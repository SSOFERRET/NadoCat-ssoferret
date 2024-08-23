export interface IImage {
  url: string;
  imageId: number;
}

export interface IImageBridge {
  imageId: number;
  postId: number;
}

export interface IProfileImage {
    url: string;
    imageId: number;
  }
  
export interface IProfileImageBridge {
    imageId: number;
    uuid: Buffer;
  }