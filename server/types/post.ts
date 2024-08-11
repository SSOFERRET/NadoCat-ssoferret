import { TCategoryId } from "./category"

export interface IPostData {
  postId: number;
  categoryId: TCategoryId;
  userId: Buffer;
}