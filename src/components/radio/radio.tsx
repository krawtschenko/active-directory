import * as RadioGroup from "@radix-ui/react-radio-group";
import style from "./radio.module.scss";
import clsx from "clsx";
import {ComponentProps} from "react";

type RadioProps = {
	options: Item[];
} & ComponentProps<typeof RadioGroup.Root>;

export type Item = {
	label: string;
	value: string;
};

export const Radio = (props: RadioProps) => {
	const {options, className, ...rest} = props;

	return (
		<RadioGroup.Root
			className={clsx(style.RadioGroupRoot, className)}
			defaultValue={options[0].value}
			{...rest}
		>
			{options.map(({label, value}) => (
				<div key={value} className={style.RadioGroupWrapper}>
					<RadioGroup.Item
						className={style.RadioGroupItem}
						value={value}
						id={value}
					>
						<RadioGroup.Indicator className={style.RadioGroupIndicator}/>
					</RadioGroup.Item>

					<label className={style.Label} htmlFor={value}>
						{label}
					</label>
				</div>
			))}
		</RadioGroup.Root>
	);
};
