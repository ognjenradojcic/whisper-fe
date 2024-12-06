import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../Sidebar";
import Groups from "../../pages/Groups";

const GroupLayout = () => {
  return (
    <div className="d-flex">
      <Groups />
      <Outlet />
    </div>
  );
};

export default GroupLayout;
