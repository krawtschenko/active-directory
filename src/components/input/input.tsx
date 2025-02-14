import { ComponentPropsWithoutRef, useId } from "react";
import clsx from "clsx";
import styles from "./input.module.scss";
import { IoCloseOutline } from "react-icons/io5";

type InputProps = {
  className?: string;
  label?: string;
  onClickButton?: () => void;
} & ComponentPropsWithoutRef<"input">;

export const Input = (props: InputProps) => {
  const { className, label, value, onClickButton, ...rest } = props;
  const id = useId();

  return (
    <div className={clsx(styles.inputRoot, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input id={id} className={styles.input} value={value} {...rest} />

        {value && (
          <button onClick={onClickButton}>
            <IoCloseOutline />
          </button>
        )}
      </div>
    </div>
  );
};
