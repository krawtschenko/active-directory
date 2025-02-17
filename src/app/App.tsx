import { useState } from "react";
import { Code } from "../components/layout/code/code";
import { Form } from "../components/layout/form/form.tsx";
import styles from "./app.module.scss";
import { Animation } from "../components/animation/animation";

export const App = () => {
  const [action, setAction] = useState("create");

  const [users, setUsers] = useState("");
  const [groups, setGroups] = useState("");
  const [folders, setFolders] = useState("");
  const [suffix, setSuffix] = useState("");

  const [kadry, setKadry] = useState(false);

  return (
    <div className={styles.app}>
      <Form
        action={action}
        users={users}
        groups={groups}
        folders={folders}
        suffix={suffix}
        kadry={kadry}
        setAction={setAction}
        setUsers={setUsers}
        setGroups={setGroups}
        setFolders={setFolders}
        setSuffix={setSuffix}
        setKadry={setKadry}
      />

      <Code
        action={action}
        users={users}
        groups={groups}
        folders={folders}
        suffix={suffix}
        kadry={kadry}
      />

      <Animation />
    </div>
  );
};
