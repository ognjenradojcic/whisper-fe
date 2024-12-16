import { FC } from "react";
import { FieldHookConfig, useField } from "formik";

interface Props {
  label: string;
  className?: string;
}

const Input: FC<Props & FieldHookConfig<string>> = ({
  label,
  className = "form-control form-control-lg",
  ...props
}) => {
  const [field, meta] = useField(props);

  const error = meta.touched && meta.error;

  return (
    <div data-mdb-input-init className="form-outline form-white mb-4">
      <label className="form-label">{label}</label>
      {/* @ts-expect-error it's ok*/}
      <input
        {...field}
        {...props}
        className={error ? className + " is-invalid" : className}
      />
      <div
        className={error ? "text-danger" : "invisible"}
        style={{ height: "35px", fontSize: "1.2rem" }}
      >
        {meta.error}
      </div>
    </div>
  );
};

export default Input;
