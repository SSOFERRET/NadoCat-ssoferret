import { IImage } from "./image";
import { ITag } from "./tag";

export interface IEvent {
  postId: number;
  categoryId: number;
  title: string;
  content: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isClosed: boolean;
  date: string;
  users: IUser;
  _count: ICount;
  eventImages: IEventImage[] | [];
  eventTags: IEventTag[] | [];
}

export interface IEventList {
  posts: IEvent[];
  pagination: IPagination;
}

export interface IEventTag {
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

export interface IEventImage {
  images: IImage;
}

interface ICount {
  eventLikes: number;
}