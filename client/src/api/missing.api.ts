import { IMissingPosts } from "../models/missing.model";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";

interface IMissingPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
}

export const getMissingPosts = async ({
  pageParam,
  limit,
  sort,
}: IMissingPostsParams): Promise<IMissingPosts> => {
  try {
    const data: IMissingPosts = await httpClient.get(
      `/boards/missings?limit=${limit ?? LIMIT}&cursor=${pageParam}&sort=${sort ?? SORT}`
    ).then((res) => res.data);

    console.log("api함수", data)

    return data;
  } catch (error) {
    console.error("Error fetching missing posts:", error);
    throw error;
  }
};
