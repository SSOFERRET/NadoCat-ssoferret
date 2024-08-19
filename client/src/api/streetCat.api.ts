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

export const fetchStreetCatPost = async ({postId}: IStreetCatDetailParams): Promise<IStreetCatDetail> => {
  console.log("fetchStreetCatPost()")
  const response = await httpClient.get<IStreetCatDetail>(`/boards/street-cats/${postId}`);
  return response.data;
}