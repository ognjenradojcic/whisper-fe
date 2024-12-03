import Echo from "laravel-echo";
import { axios } from "../config/axios";
import config from "../config/config";

export const MessageService = {
  async oldMessages(otherUserId: string) {
    const response = await axios.get(
      `${config.baseUrl}/messages/${otherUserId}/chat`
    );

    return response;
  },

  async create(data: { receiver_id: string; payload: string }) {
    return await axios.post(`${config.baseUrl}/messages`, data);
  },
};
