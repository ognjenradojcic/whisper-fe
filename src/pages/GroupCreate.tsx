import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import Input from "../components/Input";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { UserService } from "../common/services/UserService";
import { IUser } from "../common/models/User";
import Select from "react-select";
import { GroupService } from "../common/services/GroupService";
import { useAuth } from "../common/context/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../components/Loading";

interface FormValues {
  name: string;
  selectedUsers: UserOption[];
}

export interface UserOption {
  value: string;
  label: string;
  public_key: string;
}

const GroupCreateSchema = Yup.object().shape({
  name: Yup.string().required("Field is required"),
  selectedUsers: Yup.array()
    .min(1, "At least one user must be selected")
    .required("Field is required"),
});

export default function GroupCreate() {
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const { authUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.index(),
  });

  const { mutate } = useMutation({
    mutationFn: async (values: FormValues) =>
      GroupService.create(values, authUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
    },
  });

  useEffect(() => {
    if (users) {
      setUserOptions(
        users.map((user: IUser) => ({
          value: `${user.id}`,
          label: user.name,
          public_key: user.public_key,
        }))
      );
    }
  }, [users]);

  if (isPending || isError) {
    return <Loading />;
  }

  const groupCreateSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    mutate(values);

    resetForm();
  };

  return (
    <div className="d-flex flex-row justify-content-center align-items-center h-100 w-100">
      <div
        className="text-white"
        style={{
          borderRadius: "1rem",
          backgroundColor: "transparent",
          fontSize: "1.5rem",
        }}
      >
        <div
          className="card-body p-5 text-center w-100"
          style={{ maxWidth: "500px" }}
        >
          <h1 className="fw-bold mb-5 text-uppercase">Create Group</h1>
          <Formik
            initialValues={{ name: "", selectedUsers: [] }}
            validationSchema={GroupCreateSchema}
            onSubmit={groupCreateSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form noValidate>
                <Input
                  label="Name"
                  name="name"
                  type="text"
                  id="name"
                  className="form-control form-control-lg"
                />
                <div style={{ minHeight: "150px" }}>
                  <label className="pb-3" style={{ fontSize: "1.5rem" }}>
                    Users
                  </label>
                  <Select
                    isMulti
                    placeholder="Users..."
                    name="users"
                    options={userOptions}
                    value={values.selectedUsers}
                    onChange={(selectedOptions) => {
                      setFieldValue("selectedUsers", selectedOptions || []);
                    }}
                    className="basic-multi-select text-black"
                    classNamePrefix="select"
                  />
                  <ErrorMessage
                    name="selectedUsers"
                    component="div"
                    className="text-danger fs-5"
                  />
                </div>

                <button
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="my-button btn btn-lg px-5 text-white"
                  type="submit"
                >
                  Create
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
