import styles from "./primary.module.scss";
import { Input } from "../../input/input";
import { Radio } from "../../radio/radio";

type PrimaryProps = {
  users: string;
  groups: string;
  setUsers: (value: string) => void;
  setGroups: (value: string) => void;
};

export const Primary = (props: PrimaryProps) => {
  const { users, groups, setUsers, setGroups } = props;

  return (
    <div className={styles.primary}>
      <Radio
        className={styles.radio}
        options={[{ label: "123", value: "123" }]}
      />

      <Input
        value={users}
        onChange={(value) => setUsers(value.currentTarget.value.trim())}
        placeholder="Loginy"
        label="Loginy użytkowników"
      />

      <Input
        value={groups}
        onChange={(value) => setGroups(value.currentTarget.value.trim())}
        placeholder="Nazwy"
        label="Nazwy grup"
      />
    </div>
  );
};
