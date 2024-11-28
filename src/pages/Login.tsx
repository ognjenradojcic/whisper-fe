import React, { useEffect } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import axios, { AxiosError } from "axios";
import { useAuth } from "../common/context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import storage from "../common/Storage";

interface FormValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .required("Field is required"),
  password: Yup.string().required("Field is required"),
});

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const LoginSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        values
      );

      let data = response?.data;

      if (data) {
        login(data);
        storage.set("user", data);
      }
    } catch (err) {
      if (err && err instanceof AxiosError)
        console.log("Error ", err.response?.data.message);
      else console.log("Error ", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
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
              }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-5 text-uppercase">Login</h2>
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={LoginSubmit}
                  >
                    {(props) => (
                      <Form>
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          id="typeEmailX"
                          className="form-control form-control-lg"
                        />
                        <Input
                          label="Password"
                          name="password"
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                        />
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-outline-light btn-lg px-5"
                          type="submit"
                        >
                          Login
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <p className="small mt-5 pb-lg-2">
                    <NavLink className="text-white-50" to={""}>
                      Forgot password?
                    </NavLink>
                  </p>
                </div>

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <NavLink to="/register" className="text-white-50 fw-bold">
                      Register
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

export default Login;
