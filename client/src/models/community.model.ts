export interface ICommunity {
  postId: number;
  title: string;
  content: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  tags: Tag[];
}

export interface Image {
  imageId: number;
  url: string;
}

export interface Tag {
  tagId: number;
  tag: string;
}
