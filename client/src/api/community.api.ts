import { ICommunityPage } from "../models/community.model";
import { httpClient } from "./http";

const LIMIT = 10;

export const getCommunityPosts = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<ICommunityPage> => {
  const response = await httpClient.get(
    `/boards/communities?limit=${LIMIT}&cursor=${pageParam}`
  );
  return response.data;
};
