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
  const [googleRedirect, setGoogleRedirect] = useState<string>("");

  const LoginSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await AuthService.login(values);

      if (response?.data) {
        login(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GoogleLogin = async () => {
    const response = await AuthService.googleRedirect();

    if (response?.data) {
      setGoogleRedirect(response?.data.url);
    }
  };

  useEffect(() => {
    GoogleLogin();

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
                  <h1 className="fw-bold mb-5 text-uppercase">Login</h1>
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={LoginSubmit}
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
                          className="my-button btn btn-lg px-5 text-white"
                          type="submit"
                        >
                          Login
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <p className="small mt-5 pb-lg-2 mb-5">
                    <NavLink className="text-white-50" to={""}>
                      Forgot password?
                    </NavLink>
                  </p>
                  <a
                    href={googleRedirect}
                    className="sidebar-link px-4 py-5 border border-secondary border-opacity-25"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="3em"
                      height="3em"
                      fill="#883CEF"
                      className="bi bi-google"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                    </svg>
                  </a>
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
