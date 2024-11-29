import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Router from "./components/Router";
import useLoadUserFromLocalStorage from "./common/hooks/useLoadUserFromLocalStorage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isLocalStorageLoaded } = useLoadUserFromLocalStorage();

  if (isLocalStorageLoaded) {
    return (
      <div>
        <main>
          <Router />
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="dark"
          />
        </main>
      </div>
    );
  }
}

export default App;
