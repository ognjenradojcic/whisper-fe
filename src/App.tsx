import Router from "./components/Router";
import useLoadUserFromLocalStorage from "./common/hooks/useLoadUserFromLocalStorage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { BroadcastService } from "./common/services/BroadcastService";

declare const bootstrap: any;

window.Pusher = Pusher;
window.Echo = BroadcastService.echo();

declare global {
  interface Window {
    Pusher: any;
    Echo: Echo<any>;
  }
}

function App() {
  const { isLocalStorageLoaded } = useLoadUserFromLocalStorage();

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
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
