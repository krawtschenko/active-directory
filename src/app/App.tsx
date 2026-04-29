import { useEffect, useState } from "react";
import { Code } from "../components/layout/code/code";
import { Form } from "../components/layout/form/form.tsx";
import styles from "./app.module.scss";
import { Radio } from "../components/radio/radio.tsx";
import { useFormState } from "./useFormState";
import type { Action } from "../types";
import type { Item } from "../components/radio/radio.tsx";

// Опції визначені поза компонентом — стабільне посилання між рендерами
const options: Item<Action>[] = [
	{ label: "Tworzenie folderu", value: "createFolder" },
	{ label: "Tworzenie grupy", value: "create" },
	{ label: "Dodanie do grupy", value: "add" },
	{ label: "Nadanie Dostępu (:RX)", value: "rx" },
	{ label: "Nadanie Dostępu (:M)", value: "m" },
	{ label: "SQL", value: "sql" },
];

type Theme = "light" | "dark";

const getSystemTheme = (): Theme => {
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}

	return "light";
};

export const App = () => {
	// setAction відокремлюємо, щоб не передавати його у Form (Form не змінює дію)
	const { setAction, ...formState } = useFormState();
	const [theme, setTheme] = useState<Theme>(getSystemTheme);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemThemeChange = (event: MediaQueryListEvent) => {
			setTheme(event.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleSystemThemeChange);

		return () => {
			mediaQuery.removeEventListener("change", handleSystemThemeChange);
		};
	}, []);

	useEffect(() => {
		document.body.dataset.theme = theme;
	}, [theme]);

	return (
		<div className={styles.app}>
			<header className={styles.header}>
				<div>
					<h1>Active Directory Helper</h1>
					<p>Generator komend administracyjnych</p>
				</div>
			</header>

			<div className={styles.block1}>
				<h2 className={styles.panelTitle}>Akcja</h2>
				<Radio
					className={styles.radio}
					options={options}
					defaultValue={formState.action}
					onValueChange={setAction}
				/>
			</div>

			<div className={styles.block2}>
				<h2 className={styles.panelTitle}>Parametry</h2>
				<Form state={formState} />
			</div>

			<div className={styles.block3}>
				<h2 className={styles.panelTitle}>Wynik</h2>
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
		</div>
	);
};
