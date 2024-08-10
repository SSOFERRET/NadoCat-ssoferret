export interface ICommunity {
  postId: number;
  categoryId: number;
  title: string;
  content: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  users: IUser;
  communityImages: ICommunityImage[] | [];
  communityTags: ICommunityTag[] | [];
}

export interface ICommunities {
  posts: ICommunity[];
  pagination: IPagination;
}

export interface ICommunityTag {
  tags: ITag;
}

interface IUser {
  id: number;
  uuid: Buffer; // 맞나..?
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

export interface ICommunityImage {
  images: IImage;
}

export interface IImage {
  imageId: number;
  url: string;
}
