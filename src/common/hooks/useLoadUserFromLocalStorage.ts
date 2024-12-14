import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import storage from "../Storage";

const useLoadUserFromLocalStorage = () => {
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const checkLocalStorageUser = async () => {
      const user = await storage.get("user");

      if (!isLocalStorageLoaded && user) {
        login(user.data);
      }

      setIsLocalStorageLoaded(true);
    };

    checkLocalStorageUser();
  }, []);

  return { isLocalStorageLoaded };
};

export default useLoadUserFromLocalStorage;
