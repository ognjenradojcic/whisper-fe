import { axios } from "../config/axios";
import config from "../config/config";

export const GroupService = {
  async index() {
    const response = await axios.get(`${config.baseUrl}/groups`);

    return response;
  },

  async get(id: string) {
    const response = await axios.get(`${config.baseUrl}/groups/${id}`);

    return response;
  },
};
