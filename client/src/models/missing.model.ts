import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { IImage } from "./image.model";
import { IMissingDetailParam } from "../api/missing.api";
// import { DeletePost } from "../components/communityAndEvent/PostMenu";

export interface IMissingPosts {
  posts: IMissing[];
  pagination: {
    "nextCursor": number | null,
    "totalCount": number
  }
}

export interface IMissingReportPosts {
  posts: IMissingReport[];
  pagination: {
    "nextCursor": number | null,
    "totalCount": number
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
    birth: string;
    gender?: string;
    detail?: string;
  };
  images: IImage[];
  time: string;
  locations: {
    latitude: number;
    longitude: number;
    detail?: string;
  };
  detail: string;
  found: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMissingReport {
  users: {
    nickname: string;
    profileImage: string | null;
    uuid: Buffer;
    id: number;
  };
  postId: number;
  missingId: number;
  images: IImage[];
  time: string;
  locations: {
    latitude: number;
    longitude: number;
    detail?: string;
  };
  detail: string;
  match: "Y" | "N" | "-";
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMenuList {
  remove: UseMutateAsyncFunction<any, Error, IMissingDetailParam, unknown>;
  edit?: any;
  changeMatch?: any;
  changeFound?: any;
};
