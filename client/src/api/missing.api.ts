import { IMissing, IMissingPosts, IMissingReport, IMissingReportPosts } from "../models/missing.model";
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

export const updateMissingPost = async ({ formData, postId }: { formData: FormData; postId: number }) => {
  try {
    const response = await httpClient.put(`/boards/missings/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating missing post:", error);
    throw error;
  }
};


// interface ISubmitData {
//   missing: {
//     time: string;
//     detail: string;
//   };
//   location: ILocation;
//   cat: {
//     name: string;
//     detail: string;
//     gender?: string;
//     birth?: string;
//   };
// }

export const createMissingPost = async (submitData: FormData) => {
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

export const createMissingReportPost = async (postId: number, submitData: FormData) => {
  try {
    const response = await httpClient.post(`/boards/missings/${postId}/reports`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating missing report post:", error);
    throw error;
  }
};

export const updateMissingReportPost = async (postId: number, submitData: FormData, reportId: number) => {
  try {
    const response = await httpClient.put(`/boards/missings/${postId}/reports/${reportId}`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating missing report post:", error);
    throw error;
  }
};

export const getMissingReport = async ({
  postId, reportId
}: { postId: number, reportId: number }) => {
  try {
    const data: IMissingReport = await httpClient.get(
      `/boards/missings/${postId}/reports/${reportId}`
    ).then((res) => res.data);

    return data;
  } catch (error) {
    console.error("Error fetching missing posts:", error);
    throw error;
  }
};


export const updateMatch = async (postId: number, reportId: number, match: string) => {
  try {
    const response = await httpClient.patch(
      `/boards/missings/${postId}/reports/${reportId}`,
      { match },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating missing report post:", error);
    throw error;
  }
};


export const deleteMissingReport = async ({
  postId, reportId
}: { postId: number, reportId: number }) => {
  try {
    const reponse = await httpClient.delete(
      `/boards/missings/${postId}/reports/${reportId}`
    );

    return reponse.data;
  } catch (error) {
    console.error("Error fetching missing posts:", error);
    throw error;
  }
};