import { Code } from "../components/layout/code/code";
import { Form } from "../components/layout/form/form.tsx";
import styles from "./app.module.scss";
import { Radio } from "../components/radio/radio.tsx";
import { Animation } from "../components/animation/animation.tsx";
import { useFormState } from "./useFormState";
import type { Action } from "../types";
import type { Item } from "../components/radio/radio.tsx";

// Опції визначені поза компонентом — стабільне посилання між рендерами
const options: Item[] = [
	{ label: "Tworzenie folderu", value: "createFolder" },
	{ label: "Tworzenie grupy", value: "create" },
	{ label: "Dodanie do grupy", value: "add" },
	{ label: "Nadanie Dostępu (:RX)", value: "rx" },
	{ label: "Nadanie Dostępu (:M)", value: "m" },
	{ label: "SQL", value: "sql" },
];

export const App = () => {
	// setAction відокремлюємо, щоб не передавати його у Form (Form не змінює дію)
	const { setAction, ...formState } = useFormState();

	return (
		<div className={styles.app}>
			<div className={styles.block1}>
				<Radio
					className={styles.radio}
					options={options}
					defaultValue={formState.action}
					onValueChange={(v) => setAction(v as Action)}
				/>
			</div>

			<div className={styles.block2}>
				<Form state={formState} />
			</div>

			<div className={styles.block3}>
				<Code
					action={formState.action}
					location={formState.location}
					users={formState.users}
					groups={formState.groups}
					folders={formState.folders}
					suffix={formState.suffix}
					prefix={formState.prefix}
					kadry={formState.kadry}
				/>
			</div>

			<Animation />
		</div>
	);
};
