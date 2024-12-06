import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../Sidebar";

const AppLayout = () => {
  return (
    <div className="d-flex flex-row vh-100 justify-content-start">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
