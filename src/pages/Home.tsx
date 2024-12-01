import { Outlet } from "react-router-dom";
import Siderbar from "../components/Sidebar";

const Home = () => {
  return (
    <>
      <div className="text-white">hello</div>
      <Outlet />
    </>
  );
};

export default Home;
