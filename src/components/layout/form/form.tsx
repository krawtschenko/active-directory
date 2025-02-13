import styles from "./form.module.scss";
import {Input} from "../../input/input";
import {Radio} from "../../radio/radio";
import {Checkbox} from "../../checkbox/checkbox.tsx";

type PrimaryProps = {
	action: string;
	users: string;
	groups: string;
	setAction: (action: string) => void;
	setUsers: (users: string) => void;
	setGroups: (groups: string) => void;
};

export const Form = (props: PrimaryProps) => {
	const {action, users, groups, setAction, setUsers, setGroups} = props;

	const options = [
		{label: "Tworzenie grupy", value: "create"},
		{label: "Dodanie do grupy", value: "add"},
	];

	return (
		<div className={styles.primary}>
			<Radio
				className={styles.radio}
				options={options}
				defaultValue={action}
				onValueChange={(value) => setAction(value)}
			/>

			<div className={styles.inputs}>
				<Input
					value={users}
					onChange={(value) => setUsers(value.currentTarget.value.trim())}
					placeholder="Login"
					label="Login użytkownika"
				/>

				<Input
					value={groups}
					onChange={(value) => setGroups(value.currentTarget.value.trim())}
					placeholder="Nazwa"
					label="Nazwa grupy"
				/>
			</div>

			<Checkbox/>
		</div>
	);
};
