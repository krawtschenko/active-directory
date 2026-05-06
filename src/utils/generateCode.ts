import type { Action, PasswordOptions } from "../types";
import { SERVER_SHARE, SQL_DOMAIN, AD_OU_GROUPS, AD_OU_KADRY, VALIDATION } from "./constants";

function assertNever(value: never): never {
  throw new Error(`Unsupported action: ${String(value)}`);
}

function sanitize(s: string): string {
  return s.replace(/\\/g, "_");
}

function buildGroupName(name: string, prefix?: string, suffix?: string, kadry = false): string {
  const base = kadry ? "GS_Firmy_Kadry_i_Place" : "GS_Firmy";
  return [base, prefix, name, suffix].filter(Boolean).map(sanitize).join("_");
}

function buildIcaclsCommand(path: string, groupName: string, permissions: string): string {
  return `icacls "${SERVER_SHARE}\\${path}" /grant "${groupName}:${permissions}"`;
}

function buildPaths(path: string): string[] {
  const parts = path.split("\\").filter(Boolean);
  const result: string[] = [];
  for (let i = parts.length; i > 0; i--) {
    result.push(parts.slice(0, i).join("\\"));
  }
  return result;
}

function createFolder(folders: string[], location?: string) {
  if (!folders?.length) return VALIDATION.ENTER_FOLDER;

  const foldersList = folders.map((f) => `"${f}"`).join(", ");
  return `$path = "${SERVER_SHARE}${location ? `\\${location}` : ""}"

if (-Not (Test-Path $path)) {
    try {
        New-Item -Path $path -ItemType Directory -Force -ErrorAction Stop | Out-Null
        Write-Host "Created base path: $path" -ForegroundColor Cyan
    } catch {
        Write-Host "Failed to create base path: $path" -ForegroundColor Red
        return
    }
}

$folders = @(${foldersList})

foreach ($folder in $folders) {
    $fullPath = "$path\\$folder"

    if (Test-Path $fullPath) {
        Write-Host "Already exists: $folder" -ForegroundColor Yellow
    } else {
        try {
            New-Item -Path $fullPath -ItemType Directory -ErrorAction Stop | Out-Null
            Write-Host "Successfully created: $folder" -ForegroundColor Green
        } catch {
            Write-Host "Failed to create: $folder" -ForegroundColor Red
        }
    }
}`;
}

function createGroup(
  users: string[],
  groups: string[],
  prefix: string,
  suffix: string,
  kadry: boolean,
) {
  if (groups.length === 0) return VALIDATION.ENTER_GROUP;

  const ouPath = kadry ? AD_OU_KADRY : AD_OU_GROUPS;
  const groupNames = groups.map((g) => `"${buildGroupName(g, prefix, suffix, kadry)}"`).join(", ");
  const userNames = users.length > 0 ? users.map((u) => `"${u}"`).join(", ") : "";

  return `$OUPath = "${ouPath}"
$Groups = @(${groupNames})
${users.length > 0 ? `$Users = @(${userNames})\n` : ""}

foreach ($GroupName in $Groups) {
    if (-not (Get-ADGroup -Filter {Name -eq $GroupName})) {
        New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security
        Write-Host "Group '$GroupName' successfully created." -ForegroundColor Green
    } else {
        Write-Host "Group '$GroupName' already exists." -ForegroundColor Yellow
    }
    ${
      users.length > 0
        ? `
    if ($Users) {
        foreach ($UserName in $Users) {
            if (Get-ADUser -Filter {SamAccountName -eq $UserName}) {
                Add-ADGroupMember -Identity $GroupName -Members $UserName
                Write-Host "User '$UserName' successfully added to group '$GroupName'." -ForegroundColor Green
            } else {
                Write-Host "User '$UserName' does not exist." -ForegroundColor Red
            }
        }
    }`
        : ""
    }
}`;
}

function addUserToGroup(
  users: string[],
  groups: string[],
  prefix: string,
  suffix: string,
) {
  if (users.length === 0 || groups.length === 0) return VALIDATION.ENTER_USER_AND_GROUP;

  const userNames = users.map((u) => `"${u}"`).join(", ");
  const groupNames = groups.map((g) => `"${buildGroupName(g, prefix, suffix)}"`).join(", ");

  return `$Users = @(${userNames})
$Groups = @(${groupNames})

$ExistingGroups = @{}
foreach ($GroupName in $Groups) {
    if (Get-ADGroup -Filter {Name -eq $GroupName} -ErrorAction SilentlyContinue) {
        $ExistingGroups[$GroupName] = $true
    } else {
        Write-Host "Group '$GroupName' does not exist." -ForegroundColor Red
    }
}

foreach ($UserName in $Users) {
    if (Get-ADUser -Filter {SamAccountName -eq $UserName} -ErrorAction SilentlyContinue) {
        foreach ($GroupName in $ExistingGroups.Keys) {
            Add-ADGroupMember -Identity $GroupName -Members $UserName
            Write-Host "User '$UserName' successfully added to group '$GroupName'." -ForegroundColor Green
        }
    } else {
        Write-Host "User '$UserName' does not exist." -ForegroundColor Red
    }
}`;
}

function grantAccessRX(folders: string[], groups: string[], suffix: string) {
  if (folders.length === 0) return VALIDATION.ENTER_FOLDER;

  const commands = new Set<string>();
  const suffixes = suffix.split(",").map((s) => s.trim()).filter(Boolean);

  const getGroupNames = (currentPath: string): string[] => {
    if (groups.length > 0) return groups.map((g) => buildGroupName(g));
    if (suffixes.length > 0) return suffixes.map((suf) => buildGroupName(currentPath, undefined, suf));
    return [buildGroupName(currentPath)];
  };

  for (const folder of folders) {
    for (const currentPath of buildPaths(folder)) {
      for (const groupName of getGroupNames(currentPath)) {
        commands.add(buildIcaclsCommand(currentPath, groupName, "RX"));
      }
    }
  }

  return Array.from(commands).join("\n") + "\n";
}

function grantAccessM(folders: string[], suffix: string) {
  if (folders.length === 0) return VALIDATION.ENTER_FOLDER;

  return folders
    .map((folder) => {
      const path = suffix ? `${folder}\\${suffix}` : folder;
      return buildIcaclsCommand(path, buildGroupName(path), "(OI)(CI)(M)");
    })
    .join("\n") + "\n";
}

function grantAccessSQL(users: string[], bases: string[]) {
  if (users.length === 0 || bases.length === 0) return VALIDATION.ENTER_USER_AND_BASE;

  const escape = (value: string) => value.replace(/]/g, "]]");

  return users
    .flatMap((u) =>
      bases.map(
        (b) =>
          `USE [${escape(b)}]\nCREATE USER [${SQL_DOMAIN}\\${escape(u)}] FOR LOGIN [${SQL_DOMAIN}\\${escape(u)}]\nALTER ROLE [db_owner] ADD MEMBER [${SQL_DOMAIN}\\${escape(u)}]`,
      ),
    )
    .join("\n\n") + "\n\n";
}

function generatePassword(length: number, options: PasswordOptions): string {
  const ambiguous = "Il";
  const filterAmbiguous = (s: string) =>
    options.noAmbiguous ? s.split("").filter((c) => !ambiguous.includes(c)).join("") : s;

  const lowerSet = filterAmbiguous("abcdefghijklmnopqrstuvwxyz");
  const upperSet = options.uppercase ? filterAmbiguous("ABCDEFGHIJKLMNOPQRSTUVWXYZ") : "";
  const digitsSet = options.numbers ? "0123456789" : "";
  const specialSet = options.symbols ? "!@#$%^&*()-_=+[]{}|;:,.<>?" : "";

  const charset = lowerSet + upperSet + digitsSet + specialSet;
  if (!charset) return "";

  const safeLength = Math.max(8, Math.min(128, length));

  try {
    const requiredSets = [lowerSet, upperSet, digitsSet, specialSet].filter(Boolean);
    const requiredBytes = new Uint32Array(requiredSets.length);
    crypto.getRandomValues(requiredBytes);
    const required = requiredSets.map((set, i) => set[requiredBytes[i] % set.length]);

    const bytes = new Uint32Array(safeLength);
    crypto.getRandomValues(bytes);
    const password = Array.from(bytes, (x) => charset[x % charset.length]);

    required.forEach((char, i) => { password[i] = char; });

    const shuffleBytes = new Uint32Array(safeLength);
    crypto.getRandomValues(shuffleBytes);
    for (let i = safeLength - 1; i > 0; i--) {
      const j = shuffleBytes[i] % (i + 1);
      [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join("");
  } catch {
    return "";
  }
}

export function generateCode(
  action: Action,
  location: string,
  users: string[],
  groups: string[],
  folders: string[],
  suffix: string,
  prefix: string,
  kadry: boolean,
  password: string,
  passwordOptions: PasswordOptions,
) {
  switch (action) {
    case "createFolder":
      return createFolder(folders, location);
    case "create":
      return createGroup(users, groups, prefix, suffix, kadry);
    case "add":
      return addUserToGroup(users, groups, prefix, suffix);
    case "rx":
      return grantAccessRX(folders, groups, suffix);
    case "m":
      return grantAccessM(folders, suffix);
    case "sql":
      return grantAccessSQL(users, groups);
    case "password":
      return generatePassword(parseInt(password) || 14, passwordOptions);
    default:
      return assertNever(action);
  }
}
