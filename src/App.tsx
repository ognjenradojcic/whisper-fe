import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Router from "./components/Router";
import useLoadUserFromLocalStorage from "./common/hooks/useLoadUserFromLocalStorage";

function App() {
  const { isLocalStorageLoaded } = useLoadUserFromLocalStorage();

  if (isLocalStorageLoaded) {
    return <Router />;
  }
}

export default App;
