import { IImage } from "./image";
import { ITag } from "./tag";

export interface ICommunity {
  postId: number;
  categoryId: number;
  title: string;
  content: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  users: IUser;
  _count: ICount;
  communityImages: ICommunityImage[] | [];
  communityTags: ICommunityTag[] | [];
}

export interface ICommunityList {
  posts: ICommunity[];
  pagination: IPagination;
}

export interface ICommunityTag {
  tags: ITag;
}

interface IUser {
  id: number;
  uuid: Buffer;
  nickname: string;
  profileImage: string | null;
}

export interface IPagination {
  nextCursor: number | null;
  totalCount: number;
}

export interface ICommunityImage {
  images: IImage;
}

interface ICount {
  communityLikes: number;
}