import { UserOption } from "../../pages/GroupCreate";
import { axios } from "../config/axios";
import config from "../config/config";
import { encryptGroupAesKey } from "./EncryptionService";

export const GroupService = {
  async index() {
    const response = await axios.get(`${config.baseUrl}/groups`);

    return response;
  },

  async get(id: string) {
    const response = await axios.get(`${config.baseUrl}/groups/${id}`);

    return response;
  },

  async create(data: { name: string; selectedUsers: UserOption[] }) {
    const mappedData = {
      name: data.name,
      user_keys: await encryptGroupAesKey(data.selectedUsers),
    };

    const response = await axios.post(`${config.baseUrl}/groups`, mappedData);

    return response;
  },
};
