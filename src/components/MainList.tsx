import { Link } from "react-router-dom";
import { IUser } from "../common/models/User";
import { IGroup } from "../common/models/Group";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";

interface MainListProps {
  headerLabel: string;
  entityService: {
    index: () => Promise<IUser[] | IGroup[]>;
  };
  route: string;
}

const MainList = ({ headerLabel, entityService, route }: MainListProps) => {
  const {
    isPending,
    isError,
    data: entities,
  } = useQuery({
    queryKey: ["entities"],
    queryFn: () => entityService.index(),
  });

  function isUser(entity: IUser | IGroup): entity is IUser {
    return (entity as IUser).status !== undefined;
  }

  if (isPending || isError) {
    return <Loading />;
  }

  return (
    <div className="d-flex justify-content-start flex-grow-1">
      <div
        className="d-flex flex-column align-items-stretch w-30 border-end border-secondary border-opacity-25"
        style={{ width: "30vw" }}
      >
        <h1 className="text-white py-5 ps-3">{headerLabel}</h1>
        <div className="search-div ps-3">
          <input
            type="search"
            className="search form-control form-control-lg text-bg-dark border border-0 w-75"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
        <ul className="list-group list-group-custom overflow-auto">
          {entities?.map((entity, index) => (
            <li className="list-group-custom list-group-item" key={index}>
              <Link
                to={`/${route}/${entity.id}`}
                className="py-3 w-100 h-100 d-block text-decoration-none text-white"
                style={{
                  fontSize: "1.4rem",
                }}
              >
                <p className="fs-2">{entity.name}</p>
                {isUser(entity) ? (
                  <p>{entity.status} </p>
                ) : (
                  <p>{entity.users.map((user) => user.name).join(", ")}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainList;
