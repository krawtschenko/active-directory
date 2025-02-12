import { useState } from "react";
import styles from "./code.module.scss";
import { IoCopyOutline } from "react-icons/io5";

type CodeProps = {
  users: string;
  groups: string;
};

export const Code = ({ users, groups }: CodeProps) => {
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const usersArray = users
    .split(/[\s,]+/) // Розділяє рядок за пробілами
    .filter(Boolean) // Видаляє порожні елементи
    .map((user) => `"${user}"`)
    .join(", ");

  const groupsArray = groups
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((group) => `"GS_Firmy_${group}"`)
    .join(", ");

  const code = `$users = @(${usersArray})\n$groups = @(${groupsArray})\nforeach ($group in $groups) {\n  foreach ($user in $users) {\n    try {\n      Add-ADGroupMember -Identity $group -Members $user\n      Write-Host "User $user successfully added to the group: $group"\n    }\n    catch {\n      Write-Host "Error adding user $user to the group: $group. Details: $_"\n    }\n  }\n}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopyButtonText("Copied");

    setTimeout(() => {
      setCopyButtonText("Copy");
    }, 2000);
  };

  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeContainer}>
        <header className={styles.codeHeader}>
          <button onClick={copyToClipboard}>
            <IoCopyOutline />
            <span>{copyButtonText}</span>
          </button>
        </header>

        <pre className={styles.codeBlock}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
