import { axios } from "../config/axios";
import config from "../config/config";
import { ChatResponse } from "../models/ChatResponse";
import { IMessage } from "../models/Message";

export const GroupChatService = {
  async oldMessages(groupId: string): Promise<ChatResponse> {
    const response = await axios.get(
      `${config.baseUrl}/messages/${groupId}/group`
    );

    return response.data.data.messages;
  },

  async create(data: { group_id: string; payload: string }): Promise<IMessage> {
    return await axios.post(`${config.baseUrl}/messages`, {
      ...data,
      private_chat: false,
    });
  },
};
