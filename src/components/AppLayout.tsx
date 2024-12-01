import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="d-flex flex-row">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
