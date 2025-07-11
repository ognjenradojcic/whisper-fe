import { axios } from "../config/axios";
import config from "../config/config";
import storage from "../Storage";

export const AuthService = {
  async login(data: { email: string; password: string }) {
    const response = await axios.post(`${config.baseUrl}/login`, data);

    if (response?.data) {
      storage.set("user", response?.data);
    }

    return response;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    const response = await axios.post(`${config.baseUrl}/register`, data);

    return response;
  },

  async logout() {
    const response = await axios.post(`${config.baseUrl}/logout`);

    return response;
  },

  async googleRedirect() {
    const response = await axios.get(`${config.baseUrl}/google/redirect`);

    return response;
  },

  async googleCallback(parameters: string) {
    const response = await axios.get(
      `${config.baseUrl}/google/callback${parameters}`
    );

    if (response?.data) {
      storage.set("user", response?.data);
    }

    return response;
  },

  async forgotPassword(data: { email: string }) {
    const response = await axios.post(
      `${config.baseUrl}/forgot-password`,
      data
    );

    return response;
  },

  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    console.log(data);
    const response = await axios.post(`${config.baseUrl}/reset-password`, data);

    return response;
  },
};
