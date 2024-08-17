import { ICommunity, ICommunityPage } from "../models/community.model";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";

interface ICommunityPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
}

interface ICommunityDetailParams {
  postId: number;
}

interface ICommunityCommentsParams {
  postId: number;
  pageParam: number;
  limit?: number;
}

export const getCommunityPosts = async ({
  pageParam,
  limit,
  sort,
}: ICommunityPostsParams): Promise<ICommunityPage> => {
  try {
    const response = await httpClient.get(
      `/boards/communities?limit=${limit ?? LIMIT}&cursor=${pageParam}&sort=${
        sort ?? SORT
      }`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
};

export const getCommunityDetail = async ({
  postId,
}: ICommunityDetailParams): Promise<ICommunity> => {
  try {
    const response = await httpClient.get(`/boards/communities/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching community detail:", error);
    throw error;
  }
};

export const getCommunityComments = async ({
  postId,
  pageParam,
  limit,
}: ICommunityCommentsParams) => {
  try {
    const response = await httpClient.get(
      `/boards/communities/${postId}/comments?limit=${
        limit ?? LIMIT
      }&cursor=${pageParam}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching community comments:", error);
    throw error;
  }
};
