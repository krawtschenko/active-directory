import { useMemo, useState } from "react";
import styles from "./code.module.scss";
import { IoCopyOutline } from "react-icons/io5";
import { generateCode } from "../../../utils/generateCode";

type CodeProps = {
  action: string;
  location: string;
  users: string;
  groups: string;
  folders: string;
  suffix: string;
  kadry: boolean;
};

export const Code = (props: CodeProps) => {
  const { action, location, users, groups, folders, suffix, kadry } = props;

  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const usersArray = useMemo(
    () => users.split(/[\s,]+/).filter(Boolean),
    [users]
  );
  const groupsArray = useMemo(
    () => groups.split(/[\s,]+/).filter(Boolean),
    [groups]
  );
  const foldersArray = useMemo(
    () => folders.split(/[\s,]+/).filter(Boolean),
    [folders]
  );

  const generatedCode = useMemo(
    () =>
      generateCode(
        action,
        location,
        usersArray,
        groupsArray,
        foldersArray,
        suffix,
        kadry
      ),
    [action, location, users, groups, folders, suffix, kadry]
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
          <span>{action === "sql" ? "SQL" : "Powershell"}</span>

          <button onClick={copyToClipboard}>
            <IoCopyOutline />
            <span>{copyButtonText}</span>
          </button>
        </header>

        <pre className={styles.codeBlock}>
          <code>{generatedCode || "Brak wygenerowanego kodu"}</code>
        </pre>
      </div>
    </div>
  );
};
