import { TCategoryId } from "./category"

export interface IPostData {
  postId: number;
  categoryId: TCategoryId;
  userId: Buffer;
}

export interface IListData {
  categoryId: TCategoryId,
  limit: number,
  sort?: string,
  orderBy: { sortBy: string; sortOrder: string },
  cursor: number | undefined
}