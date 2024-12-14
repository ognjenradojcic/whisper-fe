import { axios } from "../config/axios";
import config from "../config/config";

export const UserService = {
  async index() {
    const response = await axios.get(`${config.baseUrl}/users`);

    return response;
  },

  async get(id: string) {
    const response = await axios.get(`${config.baseUrl}/users/${id}`);

    return response;
  },

  async update(id: number, data: { name: string; public_key: string }) {
    const response = await axios.patch(`${config.baseUrl}/users/${id}`, data);

    return response;
  },
};
