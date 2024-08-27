import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

export const formatViews = (views: number) => {
  const numberFormat = new Intl.NumberFormat("ko", {
    notation: "compact",
  });

  return numberFormat.format(views);
};

export const formatAgo = (date: string) => {
  dayjs.extend(relativeTime);
  dayjs.locale("ko");
  return dayjs(date).fromNow();
};

export const formatDate = (date: string, time?: boolean) => {
  const dateFormat = new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: time ? "numeric" : undefined,
    minute: time ? "numeric" : undefined,
    timeZone: "UTC",
  });

  const parsedDate = new Date(date);
  return dateFormat.format(parsedDate);
};
