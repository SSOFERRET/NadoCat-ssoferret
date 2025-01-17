import { ILocation } from "./location";
export interface IMissingCat {
  name: string;
  detail?: string;
  gender?: string;
  birth?: string;
  uuid: Buffer;
}

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

export interface IMissingReport {
  missingId: number;
  uuid: Buffer;
  time: string;
  locationId: number;
  detail: string;
  thumbnail: number;
  match: string;
}
