import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../common/context/AuthProvider";
import Chat from "./Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AppLayout from "./layout/AppLayout";
import ChatsLayout from "./layout/ChatLayout";
import GroupLayout from "./layout/GroupLayout";
import SingleChat from "../pages/SingleChat";
import GroupChat from "../pages/GroupChat";
import Page404 from "../pages/404";

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
      <Route path="/404" element={<Page404 />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/chats" element={<ChatsLayout />}>
          <Route path=":receiverId" element={<SingleChat />} />
        </Route>
        <Route path="/groups" element={<GroupLayout />}>
          <Route path=":groupId" element={<GroupChat />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
