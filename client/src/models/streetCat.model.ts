export interface IStreetCatPost {
  postId: number;
  thumbnail: string;
  name: string;
  createdAt: Date;
}

export interface IStreetCat {
  postId: number;
  categoryId: number;
  name: string;
  gender: string;
  neutered: string;
  // neuteredDate?: Date;
  discoveryDate: Date;
  locationId: number;
  content: string;
  views: number;
  createdAt: Date;
  // updatedAt?: Date;
  thumbnail?: number;
  // uuid?: Buffer;
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
}