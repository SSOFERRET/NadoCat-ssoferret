import { IEventDetail, IEventPage } from "../models/event.model";
import { ICommentDeleteRequest, ICommentPostRequest, ICommentPutRequest } from "./community.api";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";

interface IEventPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
}

export interface IEventDetailParams {
  postId: number;
}

interface IEventCommentsParams {
  postId: number;
  pageParam: number;
  limit?: number;
}

// CHECKLIST
// [ ] 게시글 수정
// [ ] 게시글 작성

export const getEventPosts = async ({ pageParam, limit, sort }: IEventPostsParams): Promise<IEventPage> => {
  try {
    const response = await httpClient.get(
      `/boards/events?limit=${limit ?? LIMIT}&cursor=${pageParam}&sort=${sort ?? SORT}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event posts:", error);
    throw error;
  }
};

export const getEventDetail = async ({ postId }: IEventDetailParams): Promise<IEventDetail> => {
  try {
    const response = await httpClient.get(`/boards/events/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event detail:", error);
    throw error;
  }
};

export const deleteEventPost = async ({ postId }: IEventDetailParams) => {
  try {
    const response = await httpClient.delete(`/boards/events/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event post:", error);
    throw error;
  }
};

export const createEventPost = async (formData: FormData) => {
  console.log(formData);
  try {
    const response = await httpClient.post(`/boards/events`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event post:", error);
    throw error;
  }
};

export const getEventComments = async ({ postId, pageParam, limit }: IEventCommentsParams) => {
  try {
    const response = await httpClient.get(
      `/boards/events/${postId}/comments?limit=${limit ?? LIMIT}&cursor=${pageParam}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching event comments:", error);
    throw error;
  }
};

export const createEventComment = async ({ postId, userId, comment }: ICommentPostRequest) => {
  try {
    const response = await httpClient.post(`/boards/events/${postId}/comments`, { postId, userId, comment });

    return response.data;
  } catch (error) {
    console.error(`Error creating event comment for post ${postId}:`, error);
    throw error;
  }
};

export const updateEventComment = async ({ postId, commentId, comment }: ICommentPutRequest) => {
  try {
    // NOTE userId 확인?
    const response = await httpClient.put(`/boards/events/${postId}/comments/${commentId}`, {
      postId,
      commentId,
      comment,
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating event comment for post ${postId}:`, error);
    throw error;
  }
};

export const deleteEventComment = async ({ postId, commentId }: ICommentDeleteRequest) => {
  try {
    const response = await httpClient.delete(`/boards/events/${postId}/comments/${commentId}`);

    return response.data;
  } catch (error) {
    console.error(`Error deleting event comment for post ${postId}:`, error);
    throw error;
  }
};
