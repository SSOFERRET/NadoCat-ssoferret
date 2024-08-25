import { httpClient } from "./http";

const LIMIT = 10;

interface IFriendsParams {
  pageParam: number;
  limit?: number;
}

export interface IFriendParams {
  followingId: string;
}

export const getFriends = async ({ pageParam, limit }: IFriendsParams) => {
  try {
    const response = await httpClient.get(`/users/followings?limit=${limit ?? LIMIT}&cursor=${pageParam}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const addFriend = async (followingId: string) => {
  try {
    const response = await httpClient.post(`/users/follows/${followingId}`);
    return response.data;
  } catch (error) {
    console.error("Error add friend:", error);
    throw error;
  }
};

export const deleteFriend = async (followingId: string) => {
  try {
    const response = await httpClient.delete(`/users/follows/${followingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting friend:", error);
    throw error;
  }
};
