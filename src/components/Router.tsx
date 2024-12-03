import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../common/context/AuthProvider";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import AppLayout from "./AppLayout";

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
      <Route index element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:receiverId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default Router;
