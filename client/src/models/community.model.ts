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
  users?: {
    uuid: string;
    nickname: string;
    profileImage: string;
  };
}

export interface Image {
  imageId: number;
  url: string;
}

export interface Tag {
  tagId: number;
  tag: string;
}

export interface IPagination {
  nextCursor: number;
  totalCount: number;
}

export interface ICommunityPage {
  pagination: IPagination;
  posts: ICommunity[];
}

export interface ICommunityPost {
  pageParams: number[];
  pages: ICommunityPage[];
}
