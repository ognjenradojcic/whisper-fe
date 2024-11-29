import { createContext, PropsWithChildren, useContext, useState } from "react";
import storage from "../Storage";

interface LoginContextType {
  isLoggedIn: boolean;
  loginData: ILoginResponse | null;
  isAdmin: boolean | undefined;
  login: (loginData: ILoginResponse) => void;
  logout: () => void;
}

export interface ILoginResponse {
  message: string;
  token: string;
  expires_in: number;
  data: any; //user
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
  const [loginData, setLoginData] = useState<ILoginResponse | null>(null);

  const isAdmin = true; // Change later, get from response

  const login = (data: ILoginResponse) => {
    setIsLoggedIn(true);
    setLoginData(data);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoginData(null);
    storage.remove("user");
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        loginData,
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
