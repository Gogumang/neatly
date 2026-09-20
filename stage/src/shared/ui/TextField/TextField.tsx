import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./TextField.module.css";

type FieldProps = {
  label?: string;
  /** 아래쪽 도움말. 에러일 때는 빨간색으로 보인다 */
  help?: ReactNode;
  /** 도움말 오른쪽 (예: 글자 수) */
  helpRight?: ReactNode;
  hasError?: boolean;
};

function Field({
  id,
  label,
  help,
  helpRight,
  hasError,
  className,
  children,
}: FieldProps & { id: string; className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.field, hasError && styles.error, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.box}>{children}</div>
      {(help || helpRight) && (
        <div className={styles.help} id={`${id}-help`}>
          <span>{help}</span>
          <span>{helpRight}</span>
        </div>
      )}
    </div>
  );
}

export type TextFieldProps = FieldProps & ComponentPropsWithoutRef<"input">;

export function TextField({ label, help, helpRight, hasError, className, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Field id={fieldId} label={label} help={help} helpRight={helpRight} hasError={hasError} className={className}>
      <input
        id={fieldId}
        className={styles.control}
        aria-invalid={hasError}
        aria-describedby={`${fieldId}-help`}
        {...rest}
      />
    </Field>
  );
}

export type TextAreaProps = FieldProps & ComponentPropsWithoutRef<"textarea">;

export function TextArea({ label, help, helpRight, hasError, className, id, ...rest }: TextAreaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Field id={fieldId} label={label} help={help} helpRight={helpRight} hasError={hasError} className={className}>
      <textarea
        id={fieldId}
        className={styles.control}
        aria-invalid={hasError}
        aria-describedby={`${fieldId}-help`}
        {...rest}
      />
    </Field>
  );
}
