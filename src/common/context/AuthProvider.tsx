import { createContext, PropsWithChildren, useContext, useState } from "react";
import storage from "../Storage";
import { IUser } from "../models/User";

interface LoginContextType {
  isLoggedIn: boolean;
  authUser: IUser | null;
  isAdmin: boolean | undefined;
  login: (loginData: IUser) => void;
  logout: () => void;
}

export interface ILoginResponse {
  message: string;
  token: string;
  expires_in: number;
  data: IUser;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const useAuth = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<IUser | null>(null);

  const isAdmin = true; // Change later, get from response

  const login = (data: IUser) => {
    setIsLoggedIn(true);
    setAuthUser(data);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthUser(null);
    storage.remove("user");
    storage.remove("private_key");
    storage.remove("public_key");
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        authUser,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default AuthProvider;
