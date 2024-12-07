import { IGroup } from "./Group";
import { IUser } from "./User";

export interface IMessage {
  id: number;
  payload: string;
  sender: IUser;
  receiver?: IUser;
  group?: IGroup;
}
