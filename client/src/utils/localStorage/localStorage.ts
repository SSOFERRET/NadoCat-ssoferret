export type SearchKeyword = {
  id: number;
  keyword: string;
};

export const setLocalStorage = (items: SearchKeyword[]) => {
  localStorage.setItem("nadocat-search", JSON.stringify(items));
};

export const getLocalStorage = () => {
  const data = localStorage.getItem("nadocat-search");
  return data ? JSON.parse(data) : [];
};

export const deleteAllLocalStorage = () => {
  localStorage.removeItem("nadocat-search");
};
