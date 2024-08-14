import { Prisma } from "@prisma/client"

export interface IStreetCats {
  postId: number
  categoryId: number
  name: string
  gender: string
  neutered: string
  neuteredDate: Date
  discoveryDate: Date
  locationId: number
  content: string
  views: number
  createdAt: Date
  updatedAt: Date
  thumbnail: number
  uuid: Buffer | string
}

export interface IStreetCatPost {
  postId: number,
  categoryId: number,
  name: string,
  gender: string,
  neutered: string,
  discoveryDate: Date,
  locationId: number,
  content: string,
  uuid: Buffer
}

export interface IStreetCatImages {
  imageId: number,
  postId: number
}

export interface IStreetCatfavorites {
  uuid: Buffer,
  postId: number
}

export interface IStreetCatcomments {
  streetCatCommentId: number,
  streetCatId: number,
  uuid: Buffer,
  comment: string,
  createdAt: Date,
  updatedAt: Date
}

export interface IImages {
  imageId: number,
  url: string
}