import styles from "./form.module.scss";
import { Input } from "../../input/input";
import { Checkbox } from "../../checkbox/checkbox.tsx";
import { ChangeEvent } from "react";
import type { FormState } from "../../../app/useFormState";

// Form отримує весь стан форми як єдиний об'єкт (без setAction — форма не змінює дію)
type FormProps = {
	state: Omit<FormState, "setAction">;
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

	const shouldShowLocationInput = action === "createFolder";
	const shouldShowUserInput = ["create", "add", "sql"].includes(action);
	const shouldShowFolderInput = ["rx", "m"].includes(action);
	const shouldShowGroupAndSuffix = !["m", "sql", "createFolder", "password"].includes(action);
	const shouldShowSuffixInput = action === "m";
	const shouldShowPrefixInput = action === "rx";
	const shouldShowSQLInput = action === "sql";
	const shouldShowPasswordLength = action === "password";

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

						{!shouldShowPrefixInput && (
							<Input
								value={prefix}
								onChange={handleInputChange(setPrefix)}
								placeholder="Prefiks"
								label="Prefiks grupy"
								onClickButton={() => setPrefix("")}
							/>
						)}

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

				{shouldShowPasswordLength && (
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
