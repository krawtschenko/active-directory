import {useState} from "react";
import {Code} from "../components/layout/code/code";
import {Form} from "../components/layout/form/form.tsx";
import styles from "./app.module.scss";
import {Radio} from "../components/radio/radio.tsx";
import {Animation} from "../components/animation/animation.tsx";

export const App = () => {
	const [action, setAction] = useState("createFolder");

	const [location, setLocation] = useState("");
	const [users, setUsers] = useState("");
	const [groups, setGroups] = useState("");
	const [folders, setFolders] = useState("");
	const [suffix, setSuffix] = useState("");

	const [kadry, setKadry] = useState(false);

	const options = [
		{label: "Tworzenie folderu", value: "createFolder"},
		{label: "Tworzenie grupy", value: "create"},
		{label: "Dodanie do grupy", value: "add"},
		{label: "Nadanie Dostępu (:RX)", value: "rx"},
		{label: "Nadanie Dostępu (:M)", value: "m"},
		{label: "SQL", value: "sql"},
	];

	function changeAction(value: string) {
		setAction(value);

		setLocation("");
		setUsers("");
		setGroups("");
		setFolders("");
		setSuffix("");
		setKadry(false);
	}

	return (
		<div className={styles.app}>
			<div className={styles.block1}>
				<Radio
					className={styles.radio}
					options={options}
					defaultValue={action}
					onValueChange={changeAction}
				/>
			</div>

			<div className={styles.block2}>
				<Form
					action={action}
					location={location}
					users={users}
					groups={groups}
					folders={folders}
					suffix={suffix}
					kadry={kadry}
					setAction={setAction}
					setLocation={setLocation}
					setUsers={setUsers}
					setGroups={setGroups}
					setFolders={setFolders}
					setSuffix={setSuffix}
					setKadry={setKadry}
				/>
			</div>

			<div className={styles.block3}>
				<Code
					action={action}
					location={location}
					users={users}
					groups={groups}
					folders={folders}
					suffix={suffix}
					kadry={kadry}
				/>
			</div>

			<Animation />
		</div>
	);
};
