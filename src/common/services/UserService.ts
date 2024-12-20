import { axios } from "../config/axios";
import config from "../config/config";
import { IUser } from "../models/User";

export const UserService = {
  async index(): Promise<IUser[]> {
    const response = await axios.get(`${config.baseUrl}/users`);

    return response.data.data;
  },

  async get(id: string) {
    const response = await axios.get(`${config.baseUrl}/users/${id}`);

    return response;
  },

  async update(data: { name?: string; status?: string; public_key?: string }) {
    const response = await axios.patch(`${config.baseUrl}/users`, data);

    return response;
  },
};
