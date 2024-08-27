import { IStreetCatComment, IStreetCatDetail, IStreetCatPost } from "../models/streetCat.model";
import { httpClient } from "./http";

interface IReadStreetCatPostsParams {
  limit: number;
  cursor?: number;
}

interface IReadStreetCatCommentsParams {
  limit: number;
  cursor?: number;
  postId: number;
}

interface IStreetCatDetailParams {
  postId: number;
}

interface IFetchStreetCatPostsResponse {
  streetCatPosts: IStreetCatPost[] | [undefined];
  nextCursor?: number;
}

interface IFetchMyStreetCatPostsResponse {
  favoriteCatPosts: IStreetCatPost[] | [undefined];
  nickname: string;
  myCatCount: number;
}

export interface ICommentCreateRequest {
  uuid: Buffer;
  postId: number;
  comment: string;
}

export interface ICommentUpdateRequest {
  uuid: Buffer;
  postId: number;
  commentId: number;
  comment: string;
}

export interface ICommentDeleteRequest {
  uuid?: Buffer;
  postId: number;
  commentId: number;
}

export const fetchStreetCatPosts = async (params: IReadStreetCatPostsParams) => {
  try {
    const response = await httpClient.get<IFetchStreetCatPostsResponse>(
      `/boards/street-cats?limit=${params.limit}&cursor=${params.cursor}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch streetCatPost:", error);
  }
}

export const createStreetCatPost = async (formData: FormData) => {
  try {
    const response = await httpClient.post(`/boards/street-cats`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create streetCatPost:", error);
  }
}

export const updateStreetCatPost = async (formData: FormData, postId: number) => {
  try {
    const response = await httpClient.put(`/boards/street-cats/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update streetCatPost:", error);
  }
}

export const getStreetCatPost = async ({postId}: IStreetCatDetailParams): Promise<IStreetCatDetail> => {
  const response = await httpClient.get<IStreetCatDetail>(`/boards/street-cats/${postId}`);
  return response.data;
}

export const deleteStreetCatPost = async ({postId}: IStreetCatDetailParams) => {
  const response = await httpClient.delete(`/boards/street-cats/${postId}`);
  return response.data;
}

export const fetchMyStreetCatPosts = async (params: IReadStreetCatPostsParams) => {
  try {
    const response = await httpClient.get<IFetchMyStreetCatPostsResponse>(
      `/users/street-cats?limit=${params.limit}&cursor=${params.cursor}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch myStreetCatPost:", error);
  }
}

export const createFavoriteCat = async (postId: number) => {
  const response = await httpClient.post(`/users/street-cats/${postId}`);
  return response.data;
}

export const deleteFavoriteCat = async (postId: number) => {
  const response = await httpClient.delete(`/users/street-cats/${postId}`);
  return response.data;
}

export const fetchStreetCatComments = async (params: IReadStreetCatCommentsParams) => {
  try {
    const response = await httpClient.get(
      `/boards/street-cats/${params.postId}/comments?limit=${params.limit}&cursor=${params.cursor}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch streetCatComments:", error);
  }
}

export const createStreetCatComment = async ({uuid, postId, comment}: ICommentCreateRequest) => {
  const response = await httpClient.post(`/boards/street-cats/${postId}/comments`, {uuid, postId, comment});
  return response.data;
}

export const updateStreetCatComment = async ({postId, comment, commentId}: ICommentUpdateRequest) => {
  const response = await httpClient.put(`/boards/street-cats/${postId}/comments/${commentId}`, {
    comment,
  });
  return response.data;
}

export const deleteStreetCatComment = async ({postId, commentId}: ICommentDeleteRequest) => {
  const response = await httpClient.delete(`/boards/street-cats/${postId}/comments/${commentId}`);
  return response.data;
}

export const getStreetCatMap = async () => {
  const response = await httpClient.get(`/boards/street-cats/map`);
  return response.data;
}