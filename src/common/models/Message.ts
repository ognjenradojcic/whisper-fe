import { MessageStatus } from "../enums/MessageStatus";
import { IGroup } from "./Group";
import { IUser } from "./User";

export interface IMessage {
  id: number;
  payload: string;
  sender: IUser;
  sender_aes_key?: string;
  receiver_aes_key?: string;
  iv?: string;
  receiver?: IUser;
  group?: IGroup;
  status?: MessageStatus;
}
