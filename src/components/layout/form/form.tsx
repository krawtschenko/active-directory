import styles from "./form.module.scss";
import { Input } from "../../input/input";
import { Checkbox } from "../../checkbox/checkbox.tsx";
import { ChangeEvent } from "react";
import type { Action } from "../../../types";
import type { FormState } from "../../../app/useFormState";

type FormProps = {
	state: Omit<FormState, "setAction">;
};

type VisibleFields = {
	location?: boolean;
	users?: boolean;
	folders?: boolean;
	groups?: boolean;
	prefix?: boolean;
	suffix?: boolean;
	sqlBases?: boolean;
	passwordLength?: boolean;
};

const FIELD_CONFIG: Record<Action, VisibleFields> = {
	createFolder: { folders: true, location: true },
	create:       { users: true, groups: true, prefix: true, suffix: true },
	add:          { users: true, groups: true, prefix: true, suffix: true },
	rx:           { folders: true, groups: true, suffix: true },
	m:            { folders: true, suffix: true },
	sql:          { users: true, sqlBases: true },
	password:     { passwordLength: true },
};

export const Form = ({ state }: FormProps) => {
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
		setLocation,
		setUsers,
		setGroups,
		setFolders,
		setSuffix,
		setPrefix,
		setKadry,
		setPassword,
		setPasswordOptions,
	} = state;

	// trim() навмисно прибраний — обрізання пробілів відбувається при сплітингу в Code
	function handleInputChange(setter: (value: string) => void) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			setter(event.target.value.replace(/ {2,}/g, " "));
		};
	}

	const f = FIELD_CONFIG[action];

	return (
		<div className={styles.primary}>
			<div className={styles.inputs}>
				{f.folders && (
					<Input
						value={folders}
						onChange={handleInputChange(setFolders)}
						placeholder="Folder"
						label="Nazwa folderu"
						onClickButton={() => setFolders("")}
					/>
				)}

				{f.location && (
					<Input
						value={location}
						onChange={handleInputChange(setLocation)}
						placeholder="Lokalizacja"
						label="Lokalizacja folderu"
						onClickButton={() => setLocation("")}
					/>
				)}

				{f.users && (
					<Input
						value={users}
						onChange={handleInputChange(setUsers)}
						placeholder="Użytkownik"
						label="Nazwa użytkownika"
						onClickButton={() => setUsers("")}
					/>
				)}

				{f.groups && (
					<Input
						value={groups}
						onChange={handleInputChange(setGroups)}
						placeholder="Grupa"
						label="Nazwa grupy"
						onClickButton={() => setGroups("")}
					/>
				)}

				{f.prefix && (
					<Input
						value={prefix}
						onChange={handleInputChange(setPrefix)}
						placeholder="Prefiks"
						label="Prefiks grupy"
						onClickButton={() => setPrefix("")}
					/>
				)}

				{f.suffix && (
					<Input
						value={suffix}
						onChange={handleInputChange(setSuffix)}
						placeholder="Sufiks"
						label="Sufiks grupy"
						onClickButton={() => setSuffix("")}
					/>
				)}

				{f.sqlBases && (
					<Input
						value={groups}
						onChange={handleInputChange(setGroups)}
						placeholder="Baza"
						label="Nazwa bazy SQL"
						onClickButton={() => setGroups("")}
					/>
				)}

				{f.passwordLength && (
					<Input
						value={password}
						onChange={handleInputChange(setPassword)}
						placeholder="14"
						label="Długość hasła"
						onClickButton={() => setPassword("")}
					/>
				)}
			</div>

			{action === "password" && (
				<div className={styles.passwordOptions}>
					<Checkbox
						checked={passwordOptions.uppercase}
						onCheckedChange={(v) => setPasswordOptions({ uppercase: !!v })}
						label="Wielkie litery"
					/>
					<Checkbox
						checked={passwordOptions.numbers}
						onCheckedChange={(v) => setPasswordOptions({ numbers: !!v })}
						label="Cyfry"
					/>
					<Checkbox
						checked={passwordOptions.symbols}
						onCheckedChange={(v) => setPasswordOptions({ symbols: !!v })}
						label="Symbole"
					/>
					<Checkbox
						checked={passwordOptions.noAmbiguous}
						onCheckedChange={(v) => setPasswordOptions({ noAmbiguous: !!v })}
						label="Bez I-l"
					/>
				</div>
			)}

			{action === "create" && (
				<Checkbox
					checked={kadry}
					onCheckedChange={setKadry}
					className={styles.checkbox}
					label="Kadry i Płace"
				/>
			)}
		</div>
	);
};
