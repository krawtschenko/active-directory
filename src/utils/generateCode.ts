import type { Action, PasswordOptions } from "../types";
import {
  SERVER_SHARE,
  SQL_DOMAIN,
  AD_OU_GROUPS,
  AD_OU_KADRY,
  VALIDATION,
} from "./constants";

function assertNever(value: never): never {
  throw new Error(`Unsupported action: ${String(value)}`);
}

function sanitize(s: string): string {
  return s.replace(/\\/g, "_");
}

function buildGroupName(
  name: string,
  prefix?: string,
  suffix?: string,
  kadry = false,
): string {
  const base = kadry ? "GS_Firmy_Kadry_i_Place" : "GS_Firmy";
  return [base, prefix, name, suffix]
    .filter((s): s is string => Boolean(s))
    .map(sanitize)
    .join("_");
}

function buildIcaclsCommand(
  path: string,
  groupName: string,
  permissions: string,
): string {
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

function createUser(name: string, surname: string, userPassword: string) {
  if (!name || !surname) return VALIDATION.ENTER_USER_DATA;

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  name = capitalize(name);
  surname = capitalize(surname);

  const fullName = `${name} ${surname}`;

  function removeDiacritics(str: string): string {
    const map: Record<string, string> = {
      ą: "a",
      ć: "c",
      ę: "e",
      ł: "l",
      ń: "n",
      ó: "o",
      ś: "s",
      ź: "z",
      ż: "z",
      Ą: "A",
      Ć: "C",
      Ę: "E",
      Ł: "L",
      Ń: "N",
      Ó: "O",
      Ś: "S",
      Ź: "Z",
      Ż: "Z",
    };
    return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (ch) => map[ch] ?? ch);
  }

  const samAccountName = `${removeDiacritics(name).toLowerCase()}.${removeDiacritics(surname).toLowerCase()}`;

  const psScript = `
Import-Module ActiveDirectory

# ── Step 1: Choose container ─────────────────────────────────
Write-Host ""
Write-Host "  Select container:" -ForegroundColor Cyan
Write-Host "  [1] Spicesolutions" -ForegroundColor Gray
Write-Host "  [2] O365 Sync" -ForegroundColor Gray
Write-Host ""
$topKey    = [Console]::ReadKey($true)
$topChoice = $topKey.KeyChar
Write-Host "  > $topChoice"

if ($topChoice -eq "1") {
    $targetOU          = "OU=Spicesolutions,OU=Uzytkownicy,OU=Szwak,DC=szwak,DC=local"
    $containerLabel    = "Spicesolutions"
    $userPrincipalName = "${samAccountName}@szwak.local"
    $emailAddress      = "${samAccountName}@spicesolutions.pl"
} else {
    $o365Base          = "OU=O365 Sync,OU=Uzytkownicy,OU=Szwak,DC=szwak,DC=local"
    $userPrincipalName = "${samAccountName}@epta.com.pl"
    $emailAddress      = "${samAccountName}@epta.com.pl"

    try {
        $subOUs = Get-ADOrganizationalUnit \`
            -Filter * \`
            -SearchBase $o365Base \`
            -SearchScope OneLevel \`
            | Select-Object -ExpandProperty Name
    } catch {
        Write-Host "  [ERROR] Could not retrieve sub-containers from AD." -ForegroundColor Red
        Write-Host "  $_" -ForegroundColor DarkRed
        exit 1
    }

    if ($subOUs.Count -eq 0) {
        Write-Host "  [WARNING] No sub-containers found, using 'O365 Sync' directly." -ForegroundColor Yellow
        $targetOU       = $o365Base
        $containerLabel = "O365 Sync"
    } else {
        Write-Host ""
        Write-Host "  Select sub-container:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $subOUs.Count; $i++) {
            Write-Host "  [$($i + 1)] $($subOUs[$i])" -ForegroundColor Gray
        }
        Write-Host ""
        $subKey         = [Console]::ReadKey($true)
        Write-Host "  > $($subKey.KeyChar)"
        $subIndex       = [int]::Parse($subKey.KeyChar) - 1
        $chosenSub      = $subOUs[$subIndex]
        $targetOU       = "OU=$chosenSub,$o365Base"
        $containerLabel = "O365 Sync \\ $chosenSub"
    }
}

# ── Step 2: Summary & confirm ────────────────────────────────
Write-Host ""
Write-Host "  Full name   : ${fullName}" -ForegroundColor White
Write-Host "  Username    : ${samAccountName}" -ForegroundColor White
Write-Host "  UPN         : $userPrincipalName" -ForegroundColor White
Write-Host "  Email       : $emailAddress" -ForegroundColor White
Write-Host "  Password    : ${userPassword}" -ForegroundColor White
Write-Host "  Container   : $containerLabel" -ForegroundColor White
Write-Host ""
Write-Host "  Proceed? [Y/n]  (Enter = Yes)" -ForegroundColor Yellow
$confirmKey = [Console]::ReadKey($true)
Write-Host ""

if ($confirmKey.Key -ne [ConsoleKey]::Enter -and $confirmKey.KeyChar -notmatch '^[Yy]$') {
    Write-Host "  Aborted." -ForegroundColor Red
    exit 0
}

# ── Step 3: Create the AD user ───────────────────────────────
try {
    $securePass = ConvertTo-SecureString "${userPassword}" -AsPlainText -Force

    New-ADUser \`
        -Name              "${fullName}" \`
        -GivenName         "${name}" \`
        -Surname           "${surname}" \`
        -SamAccountName    "${samAccountName}" \`
        -UserPrincipalName $userPrincipalName \`
        -EmailAddress      $emailAddress \`
        -AccountPassword   $securePass \`
        -Path              $targetOU \`
        -Enabled           $true \`
        -ChangePasswordAtLogon $false

    Write-Host ""
    Write-Host "  [OK] User created successfully." -ForegroundColor Green
    Write-Host ""
    Write-Host "  Full name   : " -NoNewline -ForegroundColor DarkGray; Write-Host "${fullName}" -ForegroundColor Cyan
    Write-Host "  Login       : " -NoNewline -ForegroundColor DarkGray; Write-Host "${samAccountName}" -ForegroundColor Yellow
    Write-Host "  Email       : " -NoNewline -ForegroundColor DarkGray; Write-Host "$emailAddress" -ForegroundColor Magenta
    Write-Host "  Password    : " -NoNewline -ForegroundColor DarkGray; Write-Host "${userPassword}" -ForegroundColor Red
    Write-Host "  Container   : " -NoNewline -ForegroundColor DarkGray; Write-Host "$containerLabel" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "  [ERROR] Failed to create user." -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor DarkRed
}
`.trim();

  return psScript;
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
  const groupNames = groups
    .map((g) => `"${buildGroupName(g, prefix, suffix, kadry)}"`)
    .join(", ");
  const userNames =
    users.length > 0 ? users.map((u) => `"${u}"`).join(", ") : "";

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
  if (users.length === 0 || groups.length === 0)
    return VALIDATION.ENTER_USER_AND_GROUP;

  const userNames = users.map((u) => `"${u}"`).join(", ");
  const groupNames = groups
    .map((g) => `"${buildGroupName(g, prefix, suffix)}"`)
    .join(", ");

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
  const suffixes = suffix
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const getGroupNames = (currentPath: string): string[] => {
    if (groups.length > 0) return groups.map((g) => buildGroupName(g));
    if (suffixes.length > 0)
      return suffixes.map((suf) => buildGroupName(currentPath, undefined, suf));
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

  return (
    folders
      .map((folder) => {
        const path = suffix ? `${folder}\\${suffix}` : folder;
        return buildIcaclsCommand(path, buildGroupName(path), "(OI)(CI)(M)");
      })
      .join("\n") + "\n"
  );
}

function grantAccessSQL(users: string[], bases: string[]) {
  if (users.length === 0 || bases.length === 0)
    return VALIDATION.ENTER_USER_AND_BASE;

  const escape = (value: string) => value.replace(/]/g, "]]");

  return (
    users
      .flatMap((u) =>
        bases.map(
          (b) =>
            `USE [${escape(b)}]\nCREATE USER [${SQL_DOMAIN}\\${escape(u)}] FOR LOGIN [${SQL_DOMAIN}\\${escape(u)}]\nALTER ROLE [db_owner] ADD MEMBER [${SQL_DOMAIN}\\${escape(u)}]`,
        ),
      )
      .join("\n\n") + "\n\n"
  );
}

function generatePassword(length: number, options: PasswordOptions): string {
  const ambiguous = "Il";
  const filterAmbiguous = (s: string) =>
    options.noAmbiguous
      ? s
          .split("")
          .filter((c) => !ambiguous.includes(c))
          .join("")
      : s;

  const lowerSet = filterAmbiguous("abcdefghijklmnopqrstuvwxyz");
  const upperSet = options.uppercase
    ? filterAmbiguous("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    : "";
  const digitsSet = options.numbers ? "0123456789" : "";
  const specialSet = options.symbols ? "!@#$%^&*()-_=+[]{}|;:,.<>?" : "";

  const charset = lowerSet + upperSet + digitsSet + specialSet;
  if (!charset) return "";

  const safeLength = Math.max(8, Math.min(128, length));

  try {
    const requiredSets = [lowerSet, upperSet, digitsSet, specialSet].filter(
      Boolean,
    );
    const requiredBytes = new Uint32Array(requiredSets.length);
    crypto.getRandomValues(requiredBytes);
    const required = requiredSets.map(
      (set, i) => set[requiredBytes[i] % set.length],
    );

    const bytes = new Uint32Array(safeLength);
    crypto.getRandomValues(bytes);
    const password = Array.from(bytes, (x) => charset[x % charset.length]);

    required.forEach((char, i) => {
      password[i] = char;
    });

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
  name: string,
  surname: string,
  userPassword: string,
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
    case "createUser": {
      const pwd = userPassword || generatePassword(14, passwordOptions);
      return createUser(name, surname, pwd);
    }
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
