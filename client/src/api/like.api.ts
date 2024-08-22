import { httpClient } from "./http";

export interface ILike {
  categoryId: number;
  postId: number;
}

export const addLike = async ({ categoryId, postId }: ILike) => {
  try {
    const response = await httpClient.post(`/posts/${categoryId}/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error("Error add like:", error);
    throw error;
  }
};

export const deleteLike = async ({ categoryId, postId }: ILike) => {
  try {
    const response = await httpClient.delete(`/posts/${categoryId}/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error("Error deleting like:", error);
    throw error;
  }
};
