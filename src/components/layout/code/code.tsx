import { useMemo, useState } from "react";
import styles from "./code.module.scss";
import { IoCopyOutline } from "react-icons/io5";
import { generateCode } from "../../../utils/generateCode";

type CodeProps = {
  action: string;
  users: string;
  groups: string;
  folders: string;
  kadry: boolean;
};

export const Code = ({ action, users, groups, folders, kadry }: CodeProps) => {
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const usersArray = users.split(/[\s,]+/).filter(Boolean);
  const groupsArray = groups.split(/[\s,]+/).filter(Boolean);
  const foldersArray = folders.split(/[\s,]+/).filter(Boolean);

  const generatedCode = useMemo(
    () => generateCode(action, usersArray, groupsArray, foldersArray, kadry),
    [action, users, groups, folders, kadry]
  );

  async function copyToClipboard() {
    if (!generatedCode || generatedCode.startsWith("Wpisz")) return;

    await navigator.clipboard.writeText(generatedCode);
    setCopyButtonText("Copied");

    setTimeout(() => {
      setCopyButtonText("Copy");
    }, 2000);
  }

  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeContainer}>
        <header className={styles.codeHeader}>
          <span>Powershell</span>

          <button onClick={copyToClipboard}>
            <IoCopyOutline />
            <span>{copyButtonText}</span>
          </button>
        </header>

        <pre className={styles.codeBlock}>
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
};
