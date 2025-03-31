function createFolder(location: string, folders: string[]) {
  if (!folders?.length) {
    return "Wpisz nazwę folderu, aby wygenerować kod";
  }

  const foldersList = folders.map((f) => `"${f}"`).join(", ");

  return `$path = "\\\\SRV04\\Firmy\\${location}"

if (-Not (Test-Path $path)) {
    Write-Host "Location does not exist: $path" -ForegroundColor Red
    return
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
  suffix: string,
  kadry: boolean
) {
  if (groups.length === 0) {
    return "Wpisz nazwę grupy, aby wygenerować kod";
  }

  const path = kadry
    ? "OU=KadryIPlace,OU=Grupy,OU=Szwak,DC=szwak,DC=local"
    : "OU=Grupy,OU=Szwak,DC=szwak,DC=local";

  const groupPrefix = kadry ? "GS_Firmy_KadryIPlace_" : "GS_Firmy_";
  const groupNames = groups
    .map(
      (g) =>
        `"${groupPrefix}${g.replace(/\\/g, "_")}${suffix ? `_${suffix}` : ""}"`
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

function addUserToGroup(users: string[], groups: string[], suffix: string) {
  if (users.length === 0 || groups.length === 0) {
    return "Wpisz nazwę użytkownika i grupy, aby wygenerować kod";
  }

  const userNames = users.map((u) => `"${u}"`).join(", ");
  const groupNames = groups
    .map((g) => `"GS_Firmy_${g}${suffix ? `_${suffix}` : ""}"`)
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

  let code = "";

  if (groups.length > 0) {
    folders.forEach((folder) => {
      groups.forEach((group) => {
        const sanitizedGroup = group?.replace(/\\/g, "_") ?? "";

        code += `icacls "\\\\SRV04\\Firmy\\${folder}" /grant "GS_Firmy_${sanitizedGroup}:RX"\n`;
      });
    });
  } else {
    folders.forEach((folder) => {
      const group = suffix
        ? `GS_Firmy_${folder}_${suffix}`
        : `GS_Firmy_${folder}`;

      const sanitizedGroup = group?.replace(/\\/g, "_") ?? "";

      code += `icacls "\\\\SRV04\\Firmy\\${folder}" /grant "${sanitizedGroup}:RX"\n`;
    });
  }

  return code;
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
  } else {
    let code = "";

    users.forEach((u) => {
      bases.forEach((b) => {
        code += `USE ${b}\nCREATE USER [SZWAK\\${u}] FOR LOGIN [SZWAK\\${u}]\nALTER ROLE [db_owner] ADD MEMBER [SZWAK\\${u}]\n\n`;
      });
    });

    return code;
  }
}

export function generateCode(
  action: string,
  location: string,
  users: string[],
  groups: string[],
  folders: string[],
  suffix: string,
  kadry: boolean
) {
  switch (action) {
    case "createFolder":
      return createFolder(location, folders);
    case "create":
      return createGroup(users, groups, suffix, kadry);
    case "add":
      return addUserToGroup(users, groups, suffix);
    case "rx":
      return grantAccessRX(folders, groups, suffix);
    case "m":
      return grantAccessM(folders, suffix);
    default:
      return grantAccessSQL(users, groups);
  }
}
