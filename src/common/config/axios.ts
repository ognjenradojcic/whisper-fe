import axiosInstance, { AxiosError, AxiosResponse } from "axios";
import config from "./config";
import storage from "../Storage";
import Toast from "../Toast";

export type ApiResponse<T = any> = AxiosResponse<{
  data: T;
  message?: string;
  token?: string;
}>;

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export type PaginatedApiResponse<T = any> = AxiosResponse<{
  data: T;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
  message?: string;
  token?: string;
}>;

export type ApiErrorResponse = AxiosError<{
  message: string;
  errors?: any;
}>;

export const axios = axiosInstance.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axios.interceptors.request.use(
  async function (config) {
    const token = storage.get("user")?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  async function (config) {
    const socketId = window.Echo.connector?.socketId();

    if (socketId) {
      config.headers["X-Socket-ID"] = socketId;
    }

    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response): ApiResponse => {
    if (response?.data?.message) {
      Toast.success(response?.data?.message);
    }

    return response;
  },

  async (error) => {
    error = error?.response;
    const token = storage.get("user")?.token;

    switch (error?.status) {
      case 401:
        if (token) {
          Toast.error("You are not authorized for this action");
          storage.remove("user");
          window.location.reload();
        }
        break;
      case 403:
        Toast.error(error.data.message || "You have no access");
        break;
      case 404:
        Toast.error("Resource not found");
        break;
      case 419:
        Toast.error("Session is expired. Log in again");
        storage.remove("user");
        break;
      case 422:
        Toast.error(
          error.data.message || "You are not authorized for this action"
        );
        break;
      case 429:
        Toast.warn("Too many requests. Try again later");
        break;
      case 500:
        Toast.error("Unexpected error. Try again later");
        break;
      case 503:
        Toast.warn("Unexpected error. Try again later");
        break;
      default:
        Toast.error(
          error?.data?.message || "Unexpected error. Try again later"
        );
    }

    return Promise.reject(error);
  }
);
