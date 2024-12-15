import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../common/models/User";
import { IGroup } from "../common/models/Group";
import { AxiosResponse } from "axios";

interface MainListProps {
  headerLabel: string;
  entityService: {
    index: () => Promise<AxiosResponse<any, any>>;
  };
  route: string;
}

const MainList = ({ headerLabel, entityService, route }: MainListProps) => {
  const [entities, setEntities] = useState<IUser[] | IGroup[]>([]);

  const getEntities = async () => {
    const response = await entityService.index();

    if (response?.data.data) {
      setEntities(response?.data.data);
    }
  };

  useEffect(() => {
    getEntities();
  }, []);

  return (
    <div className="d-flex justify-content-start flex-grow-1">
      <div
        className="d-flex flex-column align-items-stretch w-30 border-end border-secondary border-opacity-25"
        style={{ width: "30vw" }}
      >
        <h1 className="text-white py-5 ps-3">{headerLabel}</h1>
        <div className="search-div ps-3">
          <div className="d-flex gap-2">
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
          </div>
          <input
            type="search"
            className="search form-control form-control-lg text-bg-dark border border-0 w-75"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
        <ul className="list-group list-group-custom overflow-auto">
          {entities.map(({ id, name }, index) => (
            <li className="list-group-custom list-group-item" key={index}>
              <Link
                to={`/${route}/${id}`}
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

export default MainList;
