import { useEffect, useRef } from "react";
import { AuthService } from "../common/services/AuthService";
import { useAuth } from "../common/context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../common/context/LoginProvider";
import Loading from "./Loading";
import storage from "../common/Storage";
import { publicKeyUpdate } from "../common/helpers/helpers";

const GoogleCallback = () => {
  const { loading, setLoading } = useLoading();
  const hasFetched = useRef(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    AuthService.googleCallback(location.search)
      .then(async (response) => {
        const userData = response?.data.data;
        if (userData) {
          login(userData);

          if (
            !userData.public_key ||
            !storage.get("private_key") ||
            userData.public_key !== storage.get("public_key")
          ) {
            publicKeyUpdate(userData);
          }

          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      navigate("/chats");
    }
  }, [loading]);

  return loading && <Loading />;
};

export default GoogleCallback;
