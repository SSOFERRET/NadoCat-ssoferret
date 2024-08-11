import { TCategoryId } from "./category"

export interface TPostData {
  postId: number;
  categoryId: TCategoryId;
  userId: Buffer;
}