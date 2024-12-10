import { Outlet } from "react-router-dom";
import Groups from "../../pages/Groups";

const GroupLayout = () => {
  return (
    <div className="d-flex flex-fill">
      <Groups />
      <Outlet />
    </div>
  );
};

export default GroupLayout;
