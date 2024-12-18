import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../common/services/AuthService";
import { useAuth } from "../common/context/AuthProvider";

const Sidebar = () => {
  const { logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const Logout = async () => {
    await AuthService.logout();

    if (isLoggedIn) {
      logout();
    }

    navigate("/login");
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-white bg-dark">
            <div className="modal-header border-bottom-1 border-secondary border-opacity-50">
              <h1
                className="modal-title"
                style={{ fontSize: "1.6rem" }}
                id="exampleModalLabel"
              >
                Are you sure you want to logout?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "1.3rem" }}>
                If you logout, your messages will be lost!
              </p>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="my-button btn text-white"
                data-bs-dismiss="modal"
                onClick={Logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="vh-100 d-flex flex-column flex-shrink-0"
        style={{ width: "6rem", backgroundColor: "#04051B" }}
      >
        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
          <li>
            <Link
              to="/chats"
              className="sidebar-link nav-link py-3 rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-delay='{"show":500,"hide":200}'
              aria-label="Chats"
              data-bs-original-title="Chats"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                fill="#883CEF"
                className="bi bi-chat"
                viewBox="0 0 16 16"
              >
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to="/groups"
              className="sidebar-link nav-link py-3 rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-delay='{"show":500,"hide":200}'
              aria-label="Groups"
              data-bs-original-title="Groups"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                fill="#883CEF"
                className="bi bi-people"
                viewBox="0 0 16 16"
              >
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg>
            </Link>
          </li>
        </ul>
        <div>
          <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
            <li>
              <Link
                to="/profile"
                className="sidebar-link nav-link py-3 rounded-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-delay='{"show":500,"hide":200}'
                aria-label="Profile"
                data-bs-original-title="Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  fill="#883CEF"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </Link>
            </li>
            <li data-bs-toggle="modal" data-bs-target="#exampleModal">
              <button
                className="sidebar-link nav-link py-3 rounded-0"
                style={{ width: "100%" }}
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-delay='{"show":500,"hide":200}'
                aria-label="Logout"
                data-bs-original-title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  fill="#883CEF"
                  className="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
