import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../common/models/User";
import { UserService } from "../common/services/UserService";

const Chats = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const getUsers = async () => {
    const response = await UserService.index();

    if (response?.data.data) {
      setUsers(response?.data.data);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="d-flex justify-content-start">
      <div
        className="d-flex flex-column align-items-stretch w-30 border-end border-secondary border-opacity-25"
        style={{ width: "55vh" }}
      >
        <h2 className="text-white p-5">Chats</h2>
        <div className="search-div pe-1">
          <button
            className="my-button btn btn-lg px-5 mb-4 text-white"
            type="submit"
          >
            All
          </button>
          <button
            className="my-button btn btn-lg px-5 mb-4 ms-3 text-white"
            type="submit"
          >
            Unread
          </button>
          <input
            type="search"
            className="search form-control form-control-lg text-bg-dark border border-0 w-75"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
        <ul className="list-group list-group-custom overflow-auto">
          {users.map(({ id, name }, index) => (
            <li className="list-group-custom list-group-item" key={index}>
              <Link
                to={`/chats/${id}`}
                className="py-3 w-100 h-100 d-block text-decoration-none text-white"
                style={{
                  fontSize: "1.4rem",
                }}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chats;
