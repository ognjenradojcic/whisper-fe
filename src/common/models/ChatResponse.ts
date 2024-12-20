import { IMessage } from "./Message";
import { IUser } from "./User";

export interface ChatResponse {
  receiver: IUser;
  messages: IMessage[];
  group_aes_key?: string;
}
