import React, { FC } from "react";
import { FieldHookConfig, useField } from "formik";

interface Props {
  label: string;
}

const Input: FC<Props & FieldHookConfig<string>> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const defaultClassName = "form-control form-control-lg";

  let error = meta.touched && meta.error;

  return (
    <div data-mdb-input-init className="form-outline form-white mb-4">
      <label className="form-label">{label}</label>
      {/* @ts-ignore */}
      <input
        {...field}
        {...props}
        className={
          meta.touched && meta.error
            ? defaultClassName + " is-invalid"
            : defaultClassName
        }
      />
      <div
        className={meta.touched && meta.error ? "text-danger" : "invisible"}
        style={{ height: "10px" }}
      >
        {meta.error}
      </div>
    </div>
  );
};

export default Input;
