import { axios } from "../config/axios";
import config from "../config/config";
import { ChatResponse } from "../models/ChatResponse";
import { IMessage } from "../models/Message";

export const SingleChatService = {
  async oldMessages(otherUserId: string): Promise<ChatResponse> {
    const response = await axios.get(
      `${config.baseUrl}/messages/${otherUserId}/chat`
    );

    return response.data.data;
  },

  async create(data: {
    receiver_id: string;
    payload: string;
    sender_aes_key: string;
    receiver_aes_key: string;
    iv: string;
  }): Promise<IMessage> {
    const response = await axios.post(`${config.baseUrl}/messages`, {
      ...data,
      private_chat: true,
    });

    return response.data;
  },
};
