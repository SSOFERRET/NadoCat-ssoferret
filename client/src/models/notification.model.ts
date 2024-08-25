import { INotificationFromDB } from "../api/notification.api";
import { ICursorBasedPagination } from "./pagination.model";

export interface INotificationPage {
  pagination: ICursorBasedPagination;
  notifications: INotificationFromDB[];
}