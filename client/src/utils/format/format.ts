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
