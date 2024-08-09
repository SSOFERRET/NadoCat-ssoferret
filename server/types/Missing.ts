import { ILocation } from "./location";

export interface IMissingCreate {
  catId: number;
  time: string;
  locationId: number;
  detail: string;
  thumbnail: number;
  uuid: Buffer;
}

export interface IMissingGet extends IMissingCreate {
  postId: number;
  location: ILocation;
  createdAt: string;
  updatedAt: string;
  found: boolean;
  views: number;
}