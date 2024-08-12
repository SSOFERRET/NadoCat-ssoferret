export interface IEvent {
  postId: number;
  categoryId: number;
  title: string;
  content: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isClosed: number;
  users: IUser;
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

export interface ITag {
  tagId: number;
  tag: string;
}

export interface IPagination {
  nextCursor: number | null;
  totalCount: number;
}

export interface IEventImage {
  images: IImage;
}

export interface IImage {
  imageId: number;
  url: string;
}
