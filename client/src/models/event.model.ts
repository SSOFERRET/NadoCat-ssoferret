import { ICommunity, ICommunityDetail } from "./community.model";
import { ICursorBasedPagination } from "./pagination.model";

export interface IEvent extends ICommunity {
  isClosed: boolean;
  date: string;
}

export interface IEventDetail extends ICommunityDetail {
  isClosed: boolean;
}

export interface IEventPage {
  pagination: ICursorBasedPagination;
  posts: IEvent[];
}
