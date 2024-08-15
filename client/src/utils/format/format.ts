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

export const formatDate = (date: string) => {
  const dateFormat = new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parsedDate = new Date(date); // 문자열을 Date 객체로 변환
  return dateFormat.format(parsedDate);
};
