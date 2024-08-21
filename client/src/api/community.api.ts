import { ICommunityDetail, ICommunityPage } from "../models/community.model";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";

interface ICommunityPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
}

export interface ICommunityDetailParams {
  postId: number;
}

interface ICommunityCommentsParams {
  postId: number;
  pageParam: number;
  limit?: number;
}

export interface ICommentPostRequest {
  postId: number;
  userId: string; // 버퍼일지도..?
  comment: string;
}

export interface ICommentPutRequest {
  postId: number;
  userId: string; // 버퍼일지도..?
  commentId: number;
  comment: string;
}

export interface ICommentDeleteRequest {
  postId: number;
  commentId: number;
}

// CHECKLIST
// [ ] 게시글 수정
// [ ] 게시글 작성

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
}: ICommunityDetailParams): Promise<ICommunityDetail> => {
  try {
    const response = await httpClient.get(`/boards/communities/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching community detail:", error);
    throw error;
  }
};

export const deleteCommunityPost = async ({
  postId,
}: ICommunityDetailParams) => {
  try {
    const response = await httpClient.delete(`/boards/communities/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting community post:", error);
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

export const createCommunityComment = async ({
  postId,
  userId,
  comment,
}: ICommentPostRequest) => {
  try {
    const response = await httpClient.post(
      `/boards/communities/${postId}/comments`,
      { postId, userId, comment }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error creating community comment for post ${postId}:`,
      error
    );
    throw error;
  }
};

export const updateCommunityComment = async ({
  postId,
  commentId,
  comment,
}: ICommentPutRequest) => {
  try {
    // NOTE userId 확인?
    const response = await httpClient.put(
      `/boards/communities/${postId}/comments/${commentId}`,
      { postId, commentId, comment }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error updating community comment for post ${postId}:`,
      error
    );
    throw error;
  }
};

export const deleteCommunityComment = async ({
  postId,
  commentId,
}: ICommentDeleteRequest) => {
  try {
    const response = await httpClient.delete(
      `/boards/communities/${postId}/comments/${commentId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error deleting community comment for post ${postId}:`,
      error
    );
    throw error;
  }
};
