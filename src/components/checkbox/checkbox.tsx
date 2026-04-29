import * as CheckboxRadix from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa6";
import styles from "./checkbox.module.scss";
import { ComponentProps, useId } from "react";
import clsx from "clsx";

type CheckboxProps = { label?: string } & ComponentProps<
  typeof CheckboxRadix.Root
>;

export const Checkbox = ({ className, label, ...rest }: CheckboxProps) => {
  // useId гарантує унікальний id — важливо для зв'язку label з input через htmlFor
  const id = useId();

  return (
    <div className={clsx(styles.checkbox, className)}>
      <CheckboxRadix.Root className={styles.CheckboxRoot} id={id} {...rest}>
        <CheckboxRadix.Indicator className={styles.CheckboxIndicator}>
          <FaCheck />
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>

      {label && (
        <label className={styles.Label} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
