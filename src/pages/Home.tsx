import { Link, Outlet } from "react-router-dom";
import Siderbar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { UserService } from "../common/services/UserService";
import { IUser } from "../common/models/User";

const Home = () => {
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
    <div className="container">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0">
        <div className="list-group list-group-flush border-none scrollarea">
          {users.map(({ id, name }, index) => (
            <Link to={`/chats/${id}`}>
              {" "}
              <div
                className="list-group-item list-group-item-action py-3 lh-sm text-white"
                style={{ backgroundColor: "transparent", fontSize: "1.3rem" }}
                key={index}
              >
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{name}</strong>
                </div>
                <div className="col-10 mb-1 small">{name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
