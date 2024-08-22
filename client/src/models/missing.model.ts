import { IImage } from "./image.model";

export interface IMissingPosts {
  posts: IMissing[];
  pagination: {
    "nextCursor": null,
    "totalCount": 31
  }
}

export interface IMissing {
  users: {
    nickname: string;
    profileImage: string | null;
    uuid: Buffer;
    id: number;
  };
  postId: number;
  missingCats: {
    missingCatId: number
    name: string;
    age?: number;
    gender?: string;
    detail?: string;
  };
  images: IImage[];
  time: string;
  locations: {
    lattitude: number;
    longitude: number;
    detail?: string;
  };
  detail: string;
  found: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}