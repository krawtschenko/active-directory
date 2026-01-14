import styles from "./form.module.scss";
import {Input} from "../../input/input";
import {Checkbox} from "../../checkbox/checkbox.tsx";
import {ChangeEvent} from "react";

type PrimaryProps = {
	action: string;
	location: string;
	users: string;
	groups: string;
	folders: string;
	suffix: string;
	kadry: boolean;
	setAction: (action: string) => void;
	setLocation: (location: string) => void;
	setUsers: (users: string) => void;
	setGroups: (groups: string) => void;
	setFolders: (folders: string) => void;
	setSuffix: (suffix: string) => void;
	setKadry: (kadry: boolean) => void;
};

export const Form = (props: PrimaryProps) => {
	const {
		action,
		location,
		users,
		groups,
		folders,
		suffix,
		kadry,
		setLocation,
		setUsers,
		setGroups,
		setFolders,
		setSuffix,
		setKadry,
	} = props;

	function handleInputChange(setter: (value: string) => void) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			setter(event.target.value.trim());
		};
	}

	const shouldShowLocationInput = ["createFolder"].includes(action);
	const shouldShowUserInput = ["create", "add", "sql"].includes(action);
	const shouldShowFolderInput = ["rx", "m"].includes(action);
	const shouldShowGroupAndSuffix = !["m", "sql", "createFolder"].includes(
		action
	);
	const shouldShowSuffixInput = ["m"].includes(action);
	const shouldShowSQLInput = action === "sql";

	return (
		<div className={styles.primary}>
			<div className={styles.inputs}>
				{shouldShowLocationInput && (
					<>
						<Input
							value={folders}
							onChange={handleInputChange(setFolders)}
							placeholder="Folder"
							label="Nazwa folderu"
							onClickButton={() => setFolders("")}
						/>

						<Input
							value={location}
							onChange={handleInputChange(setLocation)}
							placeholder="Lokalizacja"
							label="Lokalizacja folderu"
							onClickButton={() => setLocation("")}
						/>
					</>
				)}

				{shouldShowUserInput && (
					<Input
						value={users}
						onChange={handleInputChange(setUsers)}
						placeholder="Użytkownik"
						label="Nazwa użytkownika"
						onClickButton={() => setUsers("")}
					/>
				)}

				{shouldShowFolderInput && (
					<Input
						value={folders}
						onChange={handleInputChange(setFolders)}
						placeholder="Folder"
						label="Nazwa folderu"
						onClickButton={() => setFolders("")}
					/>
				)}

				{shouldShowGroupAndSuffix && (
					<>
						<Input
							value={groups}
							onChange={handleInputChange(setGroups)}
							placeholder="Grupa"
							label="Nazwa grupy"
							onClickButton={() => setGroups("")}
						/>

						<Input
							value={suffix}
							onChange={handleInputChange(setSuffix)}
							placeholder="Sufiks"
							label="Sufiks grupy"
							onClickButton={() => setSuffix("")}
						/>
					</>
				)}

				{shouldShowSuffixInput && (
					<Input
						value={suffix}
						onChange={handleInputChange(setSuffix)}
						placeholder="Sufiks"
						label="Sufiks grupy"
						onClickButton={() => setSuffix("")}
					/>
				)}

				{shouldShowSQLInput && (
					<Input
						value={groups}
						onChange={handleInputChange(setGroups)}
						placeholder="Baza"
						label="Nazwa bazy SQL"
						onClickButton={() => setGroups("")}
					/>
				)}
			</div>

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
