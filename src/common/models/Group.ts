import { IUser } from "./User";

export interface IGroup {
  id: number;
  name: string;
  public_key?: string;
  users?: IUser[];
}
