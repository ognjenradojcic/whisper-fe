import { GroupService } from "../common/services/GroupService";
import MainList from "../components/MainList";

const Groups = () => {
  return (
    <MainList
      headerLabel="Groups"
      entityService={GroupService}
      route="groups"
    />
  );
};

export default Groups;
