import Router from "./components/Router";
import useLoadUserFromLocalStorage from "./common/hooks/useLoadUserFromLocalStorage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

declare var bootstrap: any;

function App() {
  const { isLocalStorageLoaded } = useLoadUserFromLocalStorage();

  useEffect(() => {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });

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
