import { ComponentPropsWithoutRef, useId } from "react";
import clsx from "clsx";
import styles from "./input.module.scss";

type InputProps = {
  className?: string;
  label?: string;
} & ComponentPropsWithoutRef<"input">;

export const Input = (props: InputProps) => {
  const { className, label, ...rest } = props;
  const id = useId();

  return (
    <div className={clsx(styles.inputRoot, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input id={id} className={styles.input} {...rest} />
      </div>
    </div>
  );
};
