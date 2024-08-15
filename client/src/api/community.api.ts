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

interface CommunityDetailParams {
  postId: number;
}

interface CommunityCommentsParams {
  postId: number;
  pageParam: number;
  limit?: number;
}

export const getCommunityPosts = async ({
  pageParam,
  limit,
  sort,
}: ICommunityPostsParams): Promise<ICommunityPage> => {
  const response = await httpClient.get(
    `/boards/communities?limit=${limit ?? LIMIT}&cursor=${pageParam}&sort=${
      sort ?? SORT
    }`
  );
  return response.data;
};

export const getCommunityDetail = async ({
  postId,
}: CommunityDetailParams): Promise<ICommunity> => {
  const response = await httpClient.get(`/boards/communities/${postId}`);
  return response.data;
};

export const getCommunityComments = async ({
  postId,
  pageParam,
  limit,
}: CommunityCommentsParams) => {
  const response = await httpClient.get(
    `/boards/communities/${postId}/comments?limit=${
      limit ?? LIMIT
    }&cursor=${pageParam}`
  );
  return response.data;
};
