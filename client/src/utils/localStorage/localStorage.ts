export type SearchKeyword = {
  id: number;
  keyword: string;
};

type SortType = "latest" | "views" | "likes";

type boradType = "events" | "communities";

export const setLocalStorage = (items: SearchKeyword[]) => {
  localStorage.setItem("nadocat-search", JSON.stringify(items));
};

export const getLocalStorage = (): SearchKeyword[] => {
  const data = localStorage.getItem("nadocat-search");
  return data ? JSON.parse(data) : [];
};

export const deleteAllLocalStorage = () => {
  localStorage.removeItem("nadocat-search");
};

export const setLocalStorageSortType = (boardType: boradType, sort: SortType) => {
  localStorage.setItem(`nadocat-${boardType}-sort`, JSON.stringify(sort));
};

export const getLocalStorageSortType = (boardType: boradType) => {
  const data = localStorage.getItem(`nadocat-${boardType}-sort`);
  return data ? JSON.parse(data) : null;
};
