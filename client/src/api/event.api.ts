import { ICommunityPage } from "../models/community.model";
import { IEvent } from "../models/event.model";
import { httpClient } from "./http";

const LIMIT = 10;
const SORT = "latest";

export type Sort = "latest" | "views" | "likes";

interface IEventPostsParams {
  pageParam: number;
  limit?: number;
  sort?: Sort;
}

interface IEventDetailParams {
  postId: number;
}

interface IEventCommentsParams {
  postId: number;
  pageParam: number;
  limit?: number;
}

export const getEventPosts = async ({
  pageParam,
  limit,
  sort,
}: IEventPostsParams): Promise<ICommunityPage> => {
  try {
    const response = await httpClient.get(
      `/boards/events?limit=${limit ?? LIMIT}&cursor=${pageParam}&sort=${
        sort ?? SORT
      }`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event posts:", error);
    throw error;
  }
};

export const getEventDetail = async ({
  postId,
}: IEventDetailParams): Promise<IEvent> => {
  try {
    const response = await httpClient.get(`/boards/events/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event detail:", error);
    throw error;
  }
};

export const getEventComments = async ({
  postId,
  pageParam,
  limit,
}: IEventCommentsParams) => {
  try {
    const response = await httpClient.get(
      `/boards/events/${postId}/comments?limit=${
        limit ?? LIMIT
      }&cursor=${pageParam}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching event comments:", error);
    throw error;
  }
};
