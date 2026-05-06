import type { Action, PasswordOptions } from "../types";

function assertNever(value: never): never {
  throw new Error(`Unsupported action: ${String(value)}`);
}

function createFolder(folders: string[], location?: string) {
  if (!folders?.length) {
    return "Wpisz nazwę folderu, aby wygenerować kod";
  }

  const foldersList = folders.map((f) => `"${f}"`).join(", ");
  return `$path = "\\\\SRV04\\Firmy${location ? `\\${location}` : ""}"

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
  if (groups.length === 0) {
    return "Wpisz nazwę grupy, aby wygenerować kod";
  }

  const path = kadry
    ? "OU=KadryIPlace,OU=Grupy,OU=Szwak,DC=szwak,DC=local"
    : "OU=Grupy,OU=Szwak,DC=szwak,DC=local";

  const groupPrefix = kadry
    ? `GS_Firmy_Kadry_i_Place_${prefix ? `${prefix}_` : ""}`
    : `GS_Firmy_${prefix ? `${prefix}_` : ""}`;
  const groupNames = groups
    .map(
      (g) =>
        `"${groupPrefix}${g.replace(/\\/g, "_")}${suffix ? `_${suffix}` : ""}"`,
    )
    .join(", ");
  const userNames =
    users.length > 0 ? users.map((u) => `"${u}"`).join(", ") : "";

  return `$OUPath = "${path}"
$Groups = @(${groupNames})
${
  users.length > 0
    ? `$Users = @(${userNames})
`
    : ""
}

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
  if (users.length === 0 || groups.length === 0) {
    return "Wpisz nazwę użytkownika i grupy, aby wygenerować kod";
  }

  const userNames = users.map((u) => `"${u}"`).join(", ");
  const groupNames = groups
    .map(
      (g) =>
        `"GS_Firmy_${prefix ? `${prefix}_` : ""}${g}${
          suffix ? `_${suffix}` : ""
        }"`,
    )
    .join(", ")
    .replace(/\\/g, "_");

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
  if (folders.length === 0) {
    return "Wpisz nazwę folderu, aby wygenerować kod";
  }

  const commands = new Set<string>();

  const suffixes = suffix
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const buildPaths = (path: string) => {
    const parts = path.split("\\").filter(Boolean);
    const result: string[] = [];

    for (let i = parts.length; i > 0; i--) {
      result.push(parts.slice(0, i).join("\\"));
    }

    return result;
  };

  folders.forEach((folder) => {
    const paths = buildPaths(folder);

    paths.forEach((currentPath) => {
      if (groups.length > 0) {
        groups.forEach((group) => {
          const sanitizedGroup = group.replace(/\\/g, "_");
          commands.add(
            `icacls "\\\\SRV04\\Firmy\\${currentPath}" /grant "GS_Firmy_${sanitizedGroup}:RX"`,
          );
        });
      } else {
        if (suffixes.length > 0) {
          suffixes.forEach((suf) => {
            const groupName = `GS_Firmy_${currentPath}_${suf}`;
            const sanitizedGroup = groupName.replace(/\\/g, "_");

            commands.add(
              `icacls "\\\\SRV04\\Firmy\\${currentPath}" /grant "${sanitizedGroup}:RX"`,
            );
          });
        } else {
          const groupName = `GS_Firmy_${currentPath}`;
          const sanitizedGroup = groupName.replace(/\\/g, "_");

          commands.add(
            `icacls "\\\\SRV04\\Firmy\\${currentPath}" /grant "${sanitizedGroup}:RX"`,
          );
        }
      }
    });
  });

  return `${Array.from(commands).join("\n")}\n`;
}

function grantAccessM(folders: string[], suffix: string) {
  if (folders.length === 0) {
    return "Wpisz nazwę folderu, aby wygenerować kod";
  }

  let code = "";

  folders.forEach((folder) => {
    const sanitizedFolder = suffix ? `${folder}\\${suffix}` : `${folder}`;
    const group = sanitizedFolder.replace(/\\/g, "_");

    code += `icacls "\\\\SRV04\\Firmy\\${sanitizedFolder}" /grant "GS_Firmy_${group}:(OI)(CI)(M)"\n`;
  });

  return code;
}

function grantAccessSQL(users: string[], bases: string[]) {
  if (users.length === 0 || bases.length === 0) {
    return "Wpisz nazwę użytkownika i bazy, aby wygenerować kod";
  }

  const escapeSqlBracketedIdentifier = (value: string) => value.replace(/]/g, "]]");
  let code = "";

  users.forEach((u) => {
    bases.forEach((b) => {
      const safeBase = escapeSqlBracketedIdentifier(b);
      const safeUser = escapeSqlBracketedIdentifier(u);
      code += `USE [${safeBase}]\nCREATE USER [SZWAK\\${safeUser}] FOR LOGIN [SZWAK\\${safeUser}]\nALTER ROLE [db_owner] ADD MEMBER [SZWAK\\${safeUser}]\n\n`;
    });
  });

  return code;
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

  // Guaranteed one char from each enabled category
  const requiredSets = [lowerSet, upperSet, digitsSet, specialSet].filter(Boolean);
  const requiredBytes = new Uint32Array(requiredSets.length);
  crypto.getRandomValues(requiredBytes);
  const required = requiredSets.map((set, i) => set[requiredBytes[i] % set.length]);

  // Fill the password array
  const bytes = new Uint32Array(safeLength);
  crypto.getRandomValues(bytes);
  const password = Array.from(bytes, (x) => charset[x % charset.length]);

  // Place required chars in first positions
  required.forEach((char, i) => { password[i] = char; });

  // Fisher-Yates shuffle
  const shuffleBytes = new Uint32Array(safeLength);
  crypto.getRandomValues(shuffleBytes);
  for (let i = safeLength - 1; i > 0; i--) {
    const j = shuffleBytes[i] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
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
