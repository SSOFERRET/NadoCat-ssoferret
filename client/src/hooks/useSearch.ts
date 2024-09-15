import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../api/search.api";
import { ITag } from "../models/tag.model";


export type TIndex = "communities" | "missings" | "streetCats" | "events" | "users" | "street-cats";

export interface ISearchData {
  title: string;
  postId: number;
  location?: string;
  time?: string;
  content?: string;
  profile: string;
  nickname: string;
  thumbnail: string;
  isClosed?: boolean;
  createdAt: string;
  tags?: ITag[];
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

const useSearch = (keyword: string): {
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

export default useSearch;
