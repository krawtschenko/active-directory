import { useMemo, useState } from "react";
import styles from "./code.module.scss";
import { IoCopyOutline, IoReload } from "react-icons/io5";
import { generateCode } from "../../../utils/generateCode";
import type { Action } from "../../../types";

type CodeProps = {
  action: Action;
  location: string;
  users: string;
  groups: string;
  folders: string;
  suffix: string;
  prefix: string;
  kadry: boolean;
  password: string;
};

export const Code = (props: CodeProps) => {
  const {
    action,
    location,
    users,
    groups,
    folders,
    suffix,
    prefix,
    kadry,
    password,
  } = props;

  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [nonce, setNonce] = useState(0);
  const isPasswordAction = action === "password";

  // Перетворюємо рядки у масиви тут — Form зберігає сирий текст без обрізання
  const usersArray = useMemo(
    () => users.split(/[\s,]+/).filter(Boolean),
    [users],
  );
  const groupsArray = useMemo(
    () => groups.split(/[\s,]+/).filter(Boolean),
    [groups],
  );
  const foldersArray = useMemo(
    () => folders.split(/[\s,]+/).filter(Boolean),
    [folders],
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
        prefix,
        kadry,
        password,
      ),
    // nonce forces recomputation when Regenerate is clicked (password action only)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      action,
      location,
      usersArray,
      groupsArray,
      foldersArray,
      prefix,
      suffix,
      kadry,
      password,
      nonce,
    ],
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
          <span>
            {action === "sql"
              ? "SQL"
              : isPasswordAction
                ? "Password"
                : "Powershell"}
          </span>

          <div className={styles.headerButtons}>
            {isPasswordAction && (
              <button onClick={() => setNonce((n) => n + 1)}>
                <IoReload />
                <span>Regenerate</span>
              </button>
            )}
            <button onClick={copyToClipboard}>
              <IoCopyOutline />
              <span>{copyButtonText}</span>
            </button>
          </div>
        </header>

        <pre className={styles.codeBlock}>
          <code>{generatedCode || "Brak wygenerowanego kodu"}</code>
        </pre>
      </div>
    </div>
  );
};
