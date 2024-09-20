import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCategorySearch, fetchSearch } from "../api/search.api";
import { ITag } from "../models/tag.model";


export type TIndex = "communities" | "missings" | "streetCats" | "events";

export interface ISearchData {
  title?: string;
  postId: number;
  location?: string;
  time?: string;
  content?: string;
  profile: string;
  nickname?: string;
  thumbnail: string;
  isClosed?: boolean;
  found?: boolean;
  createdAt: string;
  tags?: ITag[];
  cat?: string;
}

export interface ISearch {
  _index: TIndex,
  _type: string,
  _id: string,
  _score: number,
  _source: ISearchData
}

export interface ISearchInfo {
  category: TIndex,
  search: ISearch[],
  totalcount: {
    value: number,
    relation: string
  }
}

export interface ISearchInfoPage {
  posts: ISearch[];
  pagination: {
    nextCursor: number | null,
    totalcount: number
  }
}

export const useSearch = (keyword: string): {
  // data: ISearch[] | undefined;
  data: ISearchInfo[] | undefined;
  isLoading: boolean;
  error: unknown;
} => {

  const { data, isLoading, error } = useQuery<ISearchInfo[]>({
    queryKey: ["opensearch", keyword],
    queryFn: () => fetchSearch(keyword),
    enabled: !!keyword,
  });

  return { data, isLoading, error };
}

export const useCategorySearch = (category: string, keyword: string) => {
  const { data, isLoading, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["opensearch", category],
    queryFn: ({ pageParam = 0 }) => fetchCategorySearch({ pageParam, category, keyword }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });
  return { data, isLoading, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage };
}
