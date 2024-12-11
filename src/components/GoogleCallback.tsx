import { useEffect, useRef, useState } from "react";
import { AuthService } from "../common/services/AuthService";
import { useAuth } from "../common/context/AuthProvider";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../common/context/LoginProvider";
import Loading from "./Loading";

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
      .then((response) => {
        if (response?.data) {
          login(response?.data);
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
