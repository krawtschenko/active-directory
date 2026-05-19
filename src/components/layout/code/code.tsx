import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./code.module.scss";
import { IoCopyOutline, IoReload } from "react-icons/io5";
import clsx from "clsx";
import { generateCode } from "../../../utils/generateCode";
import type { FormState } from "../../../app/useFormState";

type CodeProps = Pick<
  FormState,
  | "action"
  | "name"
  | "surname"
  | "userPassword"
  | "location"
  | "users"
  | "groups"
  | "folders"
  | "suffix"
  | "prefix"
  | "kadry"
  | "password"
  | "passwordOptions"
>;

const parseList = (input: string) => input.split(/[\s,]+/).filter(Boolean);

export const Code = (props: CodeProps) => {
  const {
    action,
    name,
    surname,
    userPassword,
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
  const isPasswordAction = action === "password";

  const usersArray = useMemo(() => parseList(users), [users]);
  const groupsArray = useMemo(() => parseList(groups), [groups]);
  const foldersArray = useMemo(() => parseList(folders), [folders]);

  const getCode = useCallback(
    () =>
      generateCode(
        name,
        surname,
        userPassword,
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
      name,
      surname,
      userPassword,
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
    ],
  );

  const [generatedCode, setGeneratedCode] = useState(getCode);
  const [morePasswords, setMorePasswords] = useState<string[]>(() =>
    isPasswordAction ? Array.from({ length: 10 }, getCode) : [],
  );

  useEffect(() => {
    setGeneratedCode(getCode());
    setMorePasswords(
      isPasswordAction ? Array.from({ length: 10 }, getCode) : [],
    );
  }, [getCode, isPasswordAction]);

  function renderColoredPassword(pwd: string) {
    return pwd.split("").map((char, i) => {
      if (/[A-Z]/.test(char))
        return (
          <span key={i} className={styles.charUpper}>
            {char}
          </span>
        );
      if (/[0-9]/.test(char))
        return (
          <span key={i} className={styles.charDigit}>
            {char}
          </span>
        );
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
              <button onClick={() => setGeneratedCode(getCode())}>
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

        <pre
          className={clsx(
            styles.codeBlock,
            isPasswordAction && styles.codeBlockPassword,
          )}
        >
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
