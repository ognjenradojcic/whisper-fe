import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../common/context/AuthProvider";
import { UserService } from "../common/services/UserService";
import Input from "../components/Input";
import { updateUserStorageData } from "../common/helpers/helpers";
import ImportExportKeys from "../components/ImportExportKeys";
import { useMutation } from "@tanstack/react-query";

interface FormValues {
  name: string;
  status: string;
}

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Field is required"),
});

const Profile = () => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { authUser } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (values: FormValues) => await UserService.update(values),
    onSuccess: (fetchedUser) => {
      if (fetchedUser) {
        updateUserStorageData(fetchedUser);
        setIsReadOnly(true);
      }
    },
  });

  const ProfileUpdateSubmit = (values: FormValues) => {
    mutate(values);
  };

  useEffect(() => {
    if (authUser?.name) {
      setName(authUser.name);
      setStatus(authUser.status);
    }
  }, [authUser]);

  return (
    <div className="d-flex justify-content-start">
      <div
        className="d-flex flex-column flex-grow-1 align-items-center border-end border-secondary border-opacity-25"
        style={{ width: "30vw", minWidth: "450px" }}
      >
        <h1 className="text-white py-5 text-center">Profile</h1>
        <div className="d-flex card bg-transparent border border-secondary border-opacity-75 w-75">
          <div className="card-body">
            <div className="d-flex flex-column">
              <Formik
                initialValues={{ name: name, status: status }}
                validationSchema={ProfileSchema}
                onSubmit={ProfileUpdateSubmit}
                enableReinitialize
              >
                {({ values, handleChange }) => (
                  <Form noValidate>
                    <h3 className="card-title text-start text-white">Name:</h3>
                    <Input
                      label=""
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      readOnly={isReadOnly}
                      className={`form-control form-control-lg fs-2 border-0 ${
                        isReadOnly ? "bg-transparent text-white" : "bg-white"
                      }`}
                    />
                    <h3 className="card-title text-start text-white">
                      Status:
                    </h3>
                    <Input
                      label=""
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      readOnly={isReadOnly}
                      className={`form-control form-control-lg fs-2 border-0 ${
                        isReadOnly ? "bg-transparent text-white" : "bg-white"
                      }`}
                    />
                    <button
                      disabled={isReadOnly}
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="my-button btn btn-lg px-5 text-white"
                      type="submit"
                    >
                      Update
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="bg-transparent border-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-delay='{"show":500,"hide":200}'
                aria-label="Edit"
                data-bs-original-title="Edit"
                onClick={() => setIsReadOnly(!isReadOnly)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  fill="#883CEF"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column gap-3 mt-auto mb-5 w-50">
          <ImportExportKeys />
        </div>
      </div>
    </div>
  );
};

export default Profile;
