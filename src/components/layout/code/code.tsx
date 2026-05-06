import { useMemo, useState } from "react";
import styles from "./code.module.scss";
import { IoCopyOutline, IoReload } from "react-icons/io5";
import clsx from "clsx";
import { generateCode } from "../../../utils/generateCode";
import type { Action, PasswordOptions } from "../../../types";

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
  passwordOptions: PasswordOptions;
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
    passwordOptions,
  } = props;

  const [copyButtonText, setCopyButtonText] = useState("Kopiuj");
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
        passwordOptions,
      ),
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
      passwordOptions,
      nonce,
    ],
  );

  const morePasswords = useMemo(
    () => {
      if (!isPasswordAction) return [];
      return Array.from({ length: 10 }, () =>
        generateCode(action, location, usersArray, groupsArray, foldersArray, suffix, prefix, kadry, password, passwordOptions)
      );
    },
    [action, location, usersArray, groupsArray, foldersArray, prefix, suffix, kadry, password, passwordOptions],
  );

  function renderColoredPassword(pwd: string) {
    return pwd.split("").map((char, i) => {
      if (/[A-Z]/.test(char)) return <span key={i} className={styles.charUpper}>{char}</span>;
      if (/[0-9]/.test(char)) return <span key={i} className={styles.charDigit}>{char}</span>;
      return <span key={i}>{char}</span>;
    });
  }

  async function copyToClipboard() {
    if (!generatedCode || generatedCode.startsWith("Wpisz")) return;

    await navigator.clipboard.writeText(generatedCode);
    setCopyButtonText("Skopiowano");

    setTimeout(() => {
      setCopyButtonText("Kopiuj");
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
                <span>Generuj</span>
              </button>
            )}
            <button onClick={copyToClipboard}>
              <IoCopyOutline />
              <span>{copyButtonText}</span>
            </button>
          </div>
        </header>

        <pre className={clsx(styles.codeBlock, isPasswordAction && styles.codeBlockPassword)}>
          <code>
            {isPasswordAction && generatedCode
              ? renderColoredPassword(generatedCode)
              : generatedCode || "Brak wygenerowanego kodu"}
          </code>
        </pre>
      </div>

      {isPasswordAction && morePasswords.length > 0 && (
        <div className={styles.historyContainer}>
          <span className={styles.historyTitle}>Więcej haseł</span>
          <div className={styles.historyItems}>
            {morePasswords.map((pwd, i) => (
              <div key={i} className={styles.historyItem}>
                <code>{pwd}</code>
                <button
                  className={styles.historyItemButton}
                  onClick={() => navigator.clipboard.writeText(pwd)}
                >
                  <IoCopyOutline />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
