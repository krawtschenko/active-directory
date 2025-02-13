import { useState } from "react";
import { Code } from "../components/layout/code/code";
import { Form } from "../components/layout/form/form.tsx";
import styles from "./app.module.scss";
import { Animation } from "../components/animation/animation";

export const App = () => {
  const [action, setAction] = useState("create");

  const [users, setUsers] = useState("");
  const [groups, setGroups] = useState("");

  return (
    <div className={styles.app}>
      <Form
        action={action}
        users={users}
        groups={groups}
        setAction={setAction}
        setUsers={setUsers}
        setGroups={setGroups}
      />

      <Code action={action} users={users} groups={groups} />

      <Animation />
    </div>
  );
};
