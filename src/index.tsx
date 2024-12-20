import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./common/context/AuthProvider";
import { LoadingProvider } from "./common/context/LoginProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </LoadingProvider>
  </React.StrictMode>
);
