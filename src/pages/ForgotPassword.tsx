import { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import { useAuth } from "../common/context/AuthProvider";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthService } from "../common/services/AuthService";
import { useLoading } from "../common/context/LoginProvider";
import Loading from "../components/Loading";

interface FormValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .required("Field is required"),
});

const ForgotPassword = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const ForgotPasswordSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      await AuthService.forgotPassword(values);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chats");
    }
  }, [isLoggedIn]);

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="text-white"
              style={{
                borderRadius: "1rem",
                backgroundColor: "transparent",
                fontSize: "1.5rem",
              }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h1 className="fw-bold mb-5 text-uppercase">
                    Forgot Password
                  </h1>
                  <Formik
                    initialValues={{ email: "" }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={ForgotPasswordSubmit}
                  >
                    {(props) => (
                      <Form noValidate>
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          id="typeEmailX"
                          className="form-control form-control-lg"
                        />
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="my-button btn btn-lg px-5 text-white"
                          type="submit"
                        >
                          Request Reset
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <p className="small mt-5 pb-lg-2 mb-5">
                    <NavLink className="text-white-50" to={"/login"}>
                      Login
                    </NavLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
