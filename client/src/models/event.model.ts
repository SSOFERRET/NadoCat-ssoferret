import { ICommunity } from "./community.model";

export interface IEvent extends ICommunity {
  isClosed: boolean;
  date: string;
}

export interface IPagination {
  nextCursor: number;
  totalCount: number;
}

export interface IEventPage {
  pagination: IPagination;
  posts: IEvent[];
}

export interface IEventPost {
  pageParams: number[];
  pages: IEvent[];
}
