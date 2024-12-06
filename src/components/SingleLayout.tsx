import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chat from "../pages/Chat";

const SingleLayout = () => {
  return (
    <Routes>
      <Route path="/home/chats/:receiverId" element={<Chat />} />
    </Routes>
  );
};

export default SingleLayout;
