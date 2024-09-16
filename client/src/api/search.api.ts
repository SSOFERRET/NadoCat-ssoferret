
import { ISearchInfo, ISearchInfoPage } from "../hooks/useSearch";
import { httpClient } from "./http";

interface ICategorySearchParams {
  pageParam: number;
  limit?: number;
  category: string;
  keyword: string;
};

export const fetchSearch = async (keyword: string): Promise<ISearchInfo[]> => {
  try {
    const response = await httpClient.get(`/searches?query=${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    throw error;
  }
};

export const fetchCategorySearch = async ({
  pageParam,
  limit,
  category,
  keyword
}: ICategorySearchParams): Promise<ISearchInfoPage> => {
  try {
    const response = await httpClient.get(
      `/searches/${category}?query=${keyword}&limit=${limit ?? 3}&cursor=${pageParam}`
    ).then((res) => res.data);
    return response;
  } catch (error) {
    console.error("Error fetching missing posts:", error);
    throw error;
  }
};
