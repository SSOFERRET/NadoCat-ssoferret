import { IPagination } from "./community.model";

export interface ICommunityPost {
  pageParams: number[];
  pages: ICommentPage[];
}

export interface ICommentPage {
  pagination: IPagination;
  comments: IComment[];
}

export interface IComment {
  commentId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  users: Users;
}

interface Users {
  uuid: string;
  nickname: string;
  profileImage: string;
}
