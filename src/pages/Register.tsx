import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const passwordRegex = /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*\W)).{8}$/;

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .required("Field is required"),
  password: Yup.string()
    .min(8)
    .matches(
      passwordRegex,
      "Password must have atleast 1 uppercase, lowercase letter and special symbol"
    )
    .required("Field is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required(),
});

const Register = () => {
  return <div></div>;
};

export default Register;
