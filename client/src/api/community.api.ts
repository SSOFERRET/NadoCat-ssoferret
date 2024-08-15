import { ICommunityPage } from "../models/community.model";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";
interface ICommunityPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
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
