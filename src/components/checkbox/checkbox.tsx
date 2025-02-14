import * as CheckboxRadix from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa6";
import styles from "./checkbox.module.scss";
import { ComponentProps } from "react";
import clsx from "clsx";

type CheckboxProps = { label?: string } & ComponentProps<
  typeof CheckboxRadix.Root
>;

export const Checkbox = ({ className, label, ...rest }: CheckboxProps) => (
  <form>
    <div className={clsx(styles.checkbox, className)}>
      <CheckboxRadix.Root
        className={styles.CheckboxRoot}
        defaultChecked
        id="c1"
        {...rest}
      >
        <CheckboxRadix.Indicator className={styles.CheckboxIndicator}>
          <FaCheck />
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>

      {label && (
        <label className={styles.Label} htmlFor="c1">
          {label}
        </label>
      )}
    </div>
  </form>
);
