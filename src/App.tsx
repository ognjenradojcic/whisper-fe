import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Router from "./components/Router";
import useLoadUserFromLocalStorage from "./common/hooks/useLoadUserFromLocalStorage";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const { isLocalStorageLoaded } = useLoadUserFromLocalStorage();

  const notify = () => toast("Wow so easy!");

  if (isLocalStorageLoaded) {
    return;
    <>
      <button onClick={notify}>Notify</button>
      <Router />
      <ToastContainer />
    </>;
  }
}

export default App;
