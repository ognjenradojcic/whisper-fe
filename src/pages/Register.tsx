import { useEffect } from "react";
import { Formik, Form, FormikValues, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuth } from "../common/context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Input from "../components/Input";
import Toast from "../common/Toast";
import { AuthService } from "../common/services/AuthService";
import config from "../common/config/config";

interface FormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must have at least 8 characters")
    .matches(
      config.passwordRegex,
      "Password must have at least 1 uppercase, lowercase letter and special symbol"
    )
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is requred"),
});

const Register = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const RegisterSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await AuthService.register(values);

      navigate("/chats");
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
                  <h1 className="fw-bold mb-5 text-uppercase">Register</h1>
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      password: "",
                      password_confirmation: "",
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={RegisterSubmit}
                  >
                    {(props) => (
                      <Form>
                        <Input
                          label="Name"
                          name="name"
                          type="text"
                          id="name"
                          className="form-control form-control-lg"
                        />
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          id="email"
                          className="form-control form-control-lg"
                        />
                        <Input
                          label="Password"
                          name="password"
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                        />
                        <Input
                          label="Confirm Password"
                          name="password_confirmation"
                          type="password"
                          id="password_confirmation"
                          className="form-control form-control-lg"
                        />
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="my-button btn btn-lg px-5 text-white"
                          type="submit"
                        >
                          Register
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div>
                    <p className="mt-5">
                      Already have an account?{" "}
                      <NavLink to="/login" className="text-white-50 fw-bold">
                        Login
                      </NavLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
