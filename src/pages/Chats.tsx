import { UserService } from "../common/services/UserService";
import MainList from "../components/MainList";

const Chats = () => {
  return (
    <MainList headerLabel="Chats" entityService={UserService} route="chats" />
  );
};

export default Chats;
