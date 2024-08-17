import { IImage } from "./image.model";
import { ITag } from "./tag.model";

export interface ICommunity {
  postId: number;
  title: string;
  content: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  images: IImage[];
  tags: ITag[];
  users?: Users;
}
export interface IPagination {
  nextCursor: number;
  totalCount: number;
}

export interface ICommunityPage {
  pagination: IPagination;
  posts: ICommunity[];
}

export interface ICommunityPost {
  pageParams: number[];
  pages: ICommunityPage[];
}

interface Users {
  uuid: string;
  nickname: string;
  profileImage: string;
}
