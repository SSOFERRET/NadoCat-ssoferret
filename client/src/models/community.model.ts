import { IImage } from "./image.model";
import { ICursorBasedPagination } from "./pagination.model";
import { ITag } from "./tag.model";

export interface ICommunity {
  postId: number;
  title: string;
  content: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
  tags: ITag[];
}

export interface ICommunityDetail extends Omit<ICommunity, "thumbnail"> {
  images: IImage[];
  users: IPostUserInfo;
}

export interface ICommunityPage {
  pagination: ICursorBasedPagination;
  posts: ICommunity[];
}

export interface IPaginatedPosts {
  pageParams: number[];
  pages: ICommunityPage[];
}

export interface IPostUserInfo {
  uuid: string;
  nickname: string;
  profileImage: string;
}
