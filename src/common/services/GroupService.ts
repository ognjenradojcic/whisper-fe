import { UserOption } from "../../pages/GroupCreate";
import { axios } from "../config/axios";
import config from "../config/config";
import { IGroup } from "../models/Group";
import { IUser } from "../models/User";
import { encryptGroupAesKey } from "./EncryptionService";

export const GroupService = {
  async index(): Promise<IGroup[]> {
    const response = await axios.get(`${config.baseUrl}/groups`);

    return response.data.data;
  },

  async get(id: string) {
    const response = await axios.get(`${config.baseUrl}/groups/${id}`);

    return response;
  },

  async create(
    data: { name: string; selectedUsers: UserOption[] },
    authUser: IUser
  ) {
    const mappedData = {
      name: data.name,
      user_keys: await encryptGroupAesKey(data.selectedUsers, authUser),
    };

    const response = await axios.post(`${config.baseUrl}/groups`, mappedData);

    return response;
  },
};
