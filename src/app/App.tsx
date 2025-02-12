import { useState } from "react";
import { Code } from "../components/layout/code/code";
import { Primary } from "../components/layout/primary/primary";
import styles from "./app.module.scss";
import { Stars } from "../components/stars/stars";

export const App = () => {
  const [users, setUsers] = useState("");
  const [groups, setGroups] = useState("");

  return (
    <div className={styles.app}>
      <Primary
        users={users}
        groups={groups}
        setUsers={setUsers}
        setGroups={setGroups}
      />

      <Code users={users} groups={groups} />

      <Stars />
    </div>
  );
};
