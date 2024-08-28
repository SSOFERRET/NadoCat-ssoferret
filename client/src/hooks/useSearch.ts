import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../api/search.api";
import { ICommunity } from "../models/community.model";
import { IEvent } from "../models/event.model";
import { IMissing } from "../models/missing.model";
import { ICat } from "../components/search/CatSearchList";

export type TIndex = "communities" | "missings" | "streetCats" | "events" | "users" | "street-cats";

export interface ISearch {
  _index: TIndex,
  _type: string,
  _id: string,
  _score: number,
  _source: ICommunity | IEvent | IMissing | ICat
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
  const { data, isLoading, error } = useQuery<ISearchInfo[] | undefined>({
    queryKey: ["opensearch", keyword],
    queryFn: () => fetchSearch(keyword),
    enabled: !!keyword,
  });

  // console.log(data);

  return { data, isLoading, error };
}

export default useSearch;
