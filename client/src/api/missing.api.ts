import { ISubmitData } from "../components/missing/MissingEventWriteForm";
import { IMissing, IMissingPosts, IMissingReportPosts } from "../models/missing.model";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";

interface IMissingPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
  missingId?: number;
}

export interface IMissingDetailParam {
  postId: number;
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

    return data;
  } catch (error) {
    console.error("Error fetching missing posts:", error);
    throw error;
  }
};

export const getMissingReportPosts = async ({
  pageParam,
  limit,
  missingId
}: IMissingPostsParams): Promise<IMissingReportPosts> => {
  try {
    const data: IMissingReportPosts = await httpClient.get(
      `/boards/missings/${missingId}/reports?limit=${limit ?? LIMIT}&cursor=${pageParam}}`
    ).then((res) => res.data);

    return data;
  } catch (error) {
    console.error("Error fetching missing posts:", error);
    throw error;
  }
};

export const getMissingDetail = async ({ postId }: IMissingDetailParam): Promise<IMissing> => {
  try {
    const response = await httpClient.get(`/boards/missings/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching missing detail:", error);
    throw error;
  }
};

export const deleteMissingPost = async ({ postId }: IMissingDetailParam) => {
  try {
    const response = await httpClient.delete(`/boards/missings/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting missing post:", error);
    throw error;
  }
};

export const createMissingPost = async (submitData: ISubmitData) => {
  try {
    const response = await httpClient.post(`/boards/missings`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating missing post:", error);
    throw error;
  }
};