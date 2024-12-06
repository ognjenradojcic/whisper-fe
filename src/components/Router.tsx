import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../common/context/AuthProvider";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Chats from "../pages/Chats";
import Register from "../pages/Register";
import ChatsLayout from "./layout/ChatLayout";
import GroupLayout from "./layout/GroupLayout";
import AppLayout from "./layout/AppLayout";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to={"/login"} />;
}

const Router = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/chats" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route path="/chats" element={<ChatsLayout />}>
          <Route path="/chats/:receiverId" element={<Chat />} />
        </Route>
        <Route path="/groups" element={<GroupLayout />}>
          <Route path="/groups/:groupId" element={<Chat />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
