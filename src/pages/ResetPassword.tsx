import { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import { useAuth } from "../common/context/AuthProvider";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { AuthService } from "../common/services/AuthService";
import config from "../common/config/config";

interface FormValues {
  password: string;
  password_confirmation: string;
}

const ResetPasswordSchema = Yup.object().shape({
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

const ResetPassword = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ResetPasswordSubmit = async (values: FormValues) => {
    try {
      await AuthService.resetPassword({
        token: searchParams.get("token"),
        email: searchParams.get("email"),
        ...values,
      });

      navigate("/login");
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
                    Reset Password
                  </h1>
                  <Formik
                    initialValues={{ password: "", password_confirmation: "" }}
                    validationSchema={ResetPasswordSchema}
                    onSubmit={ResetPasswordSubmit}
                  >
                    {() => (
                      <Form noValidate>
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
                          Reset Password
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

export default ResetPassword;
