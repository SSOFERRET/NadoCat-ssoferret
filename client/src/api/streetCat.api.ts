import { IStreetCatDetail, IStreetCatPost } from "../models/streetCat.model";
import { httpClient } from "./http";

interface IReadStreetCatPostsParams {
  limit: number;
  cursor?: number;
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
  nextCursor?: number;
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

export const getStreetCatPost = async ({postId}: IStreetCatDetailParams): Promise<IStreetCatDetail> => {
  const response = await httpClient.get<IStreetCatDetail>(`/boards/street-cats/${postId}`);
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