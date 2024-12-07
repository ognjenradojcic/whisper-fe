import Echo from "laravel-echo";
import { axios } from "../config/axios";
import config from "../config/config";

export const GroupChatService = {
  async oldMessages(groupId: string) {
    const response = await axios.get(
      `${config.baseUrl}/messages/${groupId}/chat`
    );

    return response;
  },

  async create(data: { group_id: string; payload: string }) {
    return await axios.post(`${config.baseUrl}/messages`, data);
  },
};
