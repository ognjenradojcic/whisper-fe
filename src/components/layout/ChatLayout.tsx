import { Outlet } from "react-router-dom";
import Chats from "../../pages/Chats";

const ChatLayout = () => {
  return (
    <div className="d-flex flex-fill">
      <Chats />
      <Outlet />
    </div>
  );
};

export default ChatLayout;
