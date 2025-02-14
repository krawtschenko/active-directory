function createGroup(users: string[], groups: string[], kadry: boolean) {
  if (groups.length === 0) {
    return 'Wpisz nazwę grupy, aby wygenerować kod"';
  }

  const path = kadry
    ? "OU=KadryIPlace,OU=Grupy,OU=Szwak,DC=szwak,DC=local"
    : "OU=Grupy,OU=Szwak,DC=szwak,DC=local";

  const groupPrefix = kadry ? "GS_Firmy_KadryIPlace_" : "GS_Firmy_";
  const groupNames = groups
    .map((g) => `"${groupPrefix}${g.replace(/\\/g, "_")}"`)
    .join(", ");

  const userNames =
    users.length > 0 ? users.map((u) => `"${u}"`).join(", ") : "";

  let script = `$OUPath = "${path}"\n$Groups = @(${groupNames})\n`;

  if (users.length > 0) {
    script += `$Users = @(${userNames})\n`;
  }

  script += `\nforeach ($GroupName in $Groups) {\n`;
  script += `    New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security\n`;
  script += `    Write-Host "Group $GroupName successfully created"\n`;

  if (users.length > 0) {
    script += `    foreach ($UserName in $Users) {\n`;
    script += `        Add-ADGroupMember -Identity $GroupName -Members $UserName\n`;
    script += `        Write-Host "User $UserName successfully added to group $GroupName"\n`;
    script += `    }\n`;
  }

  script += `}`;

  return script;
}

function addUserToGroup(users: string[], groups: string[]) {
  if (users.length === 0 || groups.length === 0) {
    return "Wpisz nazwę użytkownika i grupy, aby wygenerować kod";
  }

  const userNames = users.map((u) => `"${u}"`).join(", ");
  const groupNames = groups.map((g) => `"GS_Firmy_${g}"`).join(", ");

  return `$Users = @(${userNames})\n$Groups = @(${groupNames})\n\nforeach ($UserName in $Users) {\n    foreach ($GroupName in $Groups) {\n        Add-ADGroupMember -Identity $GroupName -Members $UserName\n        Write-Host "User '$UserName' successfully added to group '$GroupName'."\n    }\n}`;
}

function grantAccessRX(groups: string[], folders: string[]) {
  if (groups.length === 0 || folders.length === 0) {
    return "Wpisz nazwę folderu i nazwę grupy, aby wygenerować kod";
  }

  const sanitizedGroup = groups[0].replace(/\\/g, "_");

  let code = "";

  folders.forEach((folder) => {
    code += `icacls "D:\\Firmy\\${folder}" /grant "GS_Firmy_${sanitizedGroup}:RX"\n`;
  });

  return code;
}

function grantAccessM(folders: string[]) {
  if (folders.length === 0) {
    return "Wpisz nazwę folderu, aby wygenerować kod";
  }

  let code = "";

  folders.forEach((folder) => {
    const sanitizedFolder = folder.replace(/\\/g, "_");
    code += `icacls "D:\\Firmy\\${folder}" /grant "GS_Firmy_${sanitizedFolder}:(OI)(CI)(M)"\n`;
  });

  return code;
}

export function generateCode(
  action: string,
  users: string[],
  groups: string[],
  folders: string[],
  kadry: boolean
) {
  switch (action) {
    case "create":
      return createGroup(users, groups, kadry);
    case "add":
      return addUserToGroup(users, groups);
    case "rx":
      return grantAccessRX(groups, folders);
    default:
      return grantAccessM(folders);
  }
}
