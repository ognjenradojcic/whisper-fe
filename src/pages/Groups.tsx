import { Link } from "react-router-dom";
import { GroupService } from "../common/services/GroupService";
import MainList from "../components/MainList";

const Groups = () => {
  return (
    <div className="d-flex flex-column ">
      <MainList
        headerLabel="Groups"
        entityService={GroupService}
        route="groups"
      />
      <div className="d-flex align-items-center justify-content-center pb-5 border-end border-secondary border-opacity-25">
        <Link
          to={"/groups/create"}
          className="my-button btn btn-lg px-5 text-white"
        >
          Create new group
        </Link>
      </div>
    </div>
  );
};

export default Groups;
