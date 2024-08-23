import { Sort } from "../../api/community.api";

export type SortType = "최신순" | "좋아요순" | "조회순";

export type SortMenu = {
  id: number;
  name: SortType;
  sortType: Sort;
};

export const sortMenu: SortMenu[] = [
  { id: 1, name: "최신순", sortType: "latest" },
  { id: 2, name: "좋아요순", sortType: "likes" },
  { id: 3, name: "조회순", sortType: "views" },
];
