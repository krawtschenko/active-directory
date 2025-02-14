import styles from "./form.module.scss";
import { Input } from "../../input/input";
import { Radio } from "../../radio/radio";
import { Checkbox } from "../../checkbox/checkbox.tsx";

type PrimaryProps = {
  action: string;
  users: string;
  groups: string;
  folders: string;
  kadry: boolean;
  setAction: (action: string) => void;
  setUsers: (users: string) => void;
  setGroups: (groups: string) => void;
  setFolders: (folders: string) => void;
  setKadry: (kadry: boolean) => void;
};

export const Form = (props: PrimaryProps) => {
  const {
    action,
    users,
    groups,
    folders,
    kadry,
    setAction,
    setUsers,
    setGroups,
    setFolders,
    setKadry,
  } = props;

  const options = [
    { label: "Tworzenie grupy", value: "create" },
    { label: "Dodanie do grupy", value: "add" },
    { label: "Nadanie Dostępu (:RX)", value: "rx" },
    { label: "Nadanie Dostępu (:M)", value: "m" },
  ];

  function changeAction(value: string) {
    setAction(value);

    setUsers("");
    setGroups("");
    setFolders("");
    setKadry(false);
  }

  return (
    <div className={styles.primary}>
      <Radio
        className={styles.radio}
        options={options}
        defaultValue={action}
        onValueChange={changeAction}
      />

      <div className={styles.inputs}>
        {(action === "create" || action === "add") && (
          <Input
            value={users}
            onChange={(value) => setUsers(value.currentTarget.value.trim())}
            placeholder="Użytkownik"
            label="Nazwa użytkownika"
            onClickButton={() => setUsers("")}
          />
        )}

        {(action === "rx" || action === "m") && (
          <Input
            value={folders}
            onChange={(value) => setFolders(value.currentTarget.value.trim())}
            placeholder="Folder"
            label="Nazwa folderu"
            onClickButton={() => setFolders("")}
          />
        )}

        {action !== "m" && (
          <Input
            value={groups}
            onChange={(value) => setGroups(value.currentTarget.value.trim())}
            placeholder="Grupa"
            label="Nazwa grupy"
            onClickButton={() => setGroups("")}
          />
        )}
      </div>

      {action === "create" && (
        <Checkbox
          checked={kadry}
          onCheckedChange={(value) => setKadry(!!value)}
          className={styles.checkbox}
          label="Kadry i Płace"
        />
      )}
    </div>
  );
};
