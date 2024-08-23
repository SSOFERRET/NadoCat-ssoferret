export interface IStreetCatPost {
  postId: number;
  categoryId: number;
  createdAt: Date;
  gender: string;
  name: string;
  thumbnail: string | null;
  streetCatFavorites: IStreetCatFavorite[];
  streetCatImages: IStreetCatImage[];
  location: ILocation
}

interface ILocation {
  longitude: number;
  latitude: number;
  detail: string;
}

interface IStreetCatImage {
  images: IImage;
}

interface IImage {
  url: string;
}

interface IStreetCatFavorite {
  postId?: number;
}

export interface IPagination {
  nextCursor: number;
  totalCount: number;
}

export interface IStreetCatPage {
  posts: IStreetCatPost[];
  pagination: IPagination;
}

export interface IStreetCat {
  postId: number;
  categoryId: number;
  name: string;
  gender: string;
  neutered: string;
  neuteredDate?: Date;
  discoveryDate: Date;
  locationId: number;
  content: string;
  views: number;
  createdAt: Date;
  updatedAt?: Date;
  thumbnail?: number;
  uuid?: Buffer;
}


export interface IStreetCatDetail extends IStreetCat {
  streetCatImages: [
    {
      imageId: number;
      url: string;
    }
  ]
  users: {
    uuid: {
      type: Buffer;
      data: number[];
    }
    nickname: string;
    profileImage: string;
  }
  location: {
    longitude: number;
    latitude: number;
    detail: string;
  };
}

export interface IStreetCatComment {
  streetCatCommentId: number;
  comment: string;
  createdAt: Date;
  users: IUsers;
}

interface IUsers {
  uuid?: Buffer;
  nickname: string;
  profileImage: string;
}

export interface ICommentPostRequest {
  postId: number;
  uuid: Buffer;
  comment: string;
}

export interface ICommentPutRequest {
  postId: number;
  // uuid: Buffer;
  commentId: number;
  comment: string;
}

export interface ICommentDeleteRequest {
  postId: number;
  commentId: number;
}