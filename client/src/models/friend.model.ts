import { ICursorBasedPagination } from "./pagination.model";

export interface IFriendPage {
  pagination: ICursorBasedPagination;
  follows: IFriend[];
}

export interface IFriend {
  id: number;
  userId: string;
  email: string;
  nickname: string;
  profileImage: string;
}
