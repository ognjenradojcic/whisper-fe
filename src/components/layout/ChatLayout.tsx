import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../Sidebar";
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
