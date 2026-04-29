import * as RadioGroup from "@radix-ui/react-radio-group";
import style from "./radio.module.scss";
import clsx from "clsx";
import { ComponentProps } from "react";

type RadioProps<T extends string> = {
  options: Item<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
} & Omit<
  ComponentProps<typeof RadioGroup.Root>,
  "value" | "defaultValue" | "onValueChange"
>;

export type Item<T extends string = string> = {
  label: string;
  value: T;
};

export const Radio = <T extends string>(props: RadioProps<T>) => {
  const { options, className, defaultValue, ...rest } = props;

  return (
    <RadioGroup.Root
      className={clsx(style.RadioGroupRoot, className)}
      defaultValue={defaultValue ?? options[0]?.value}
      {...rest}
    >
      {options.map(({ label, value }) => (
        <div key={value} className={style.RadioGroupWrapper}>
          <RadioGroup.Item className={style.RadioGroupItem} value={value} id={value}>
            <RadioGroup.Indicator className={style.RadioGroupIndicator} />
          </RadioGroup.Item>

          <label className={style.Label} htmlFor={value}>
            {label}
          </label>
        </div>
      ))}
    </RadioGroup.Root>
  );
};
