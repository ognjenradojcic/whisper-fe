import { axios } from "../config/axios";
import config from "../config/config";

export const SingleChatService = {
  async oldMessages(otherUserId: string) {
    const response = await axios.get(
      `${config.baseUrl}/messages/${otherUserId}/chat`
    );

    return response;
  },

  async create(data: {
    receiver_id: string;
    payload: string;
    sender_aes_key: string;
    receiver_aes_key: string;
    iv: string;
  }) {
    return await axios.post(`${config.baseUrl}/messages`, {
      ...data,
      private_chat: true,
    });
  },
};
