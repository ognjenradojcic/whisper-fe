import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

function App() {
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<AuthOutlet fallbackPath="/login" />}>
      <Route path="/chat" element={<Chat />} />
    </Route>
  </Routes>;
  return <Login />;
}

export default App;
