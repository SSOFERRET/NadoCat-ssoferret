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

export const calculateAge = (dateString: string) => {
  const birthDate = new Date(dateString);

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
};

export const extractDateTimeComponents = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const amPm = hours >= 12 ? "오후" : "오전";
  hours = hours % 12 || 12;

  const formattedDate = `${year}-${month}-${day}`;

  return [formattedDate, amPm, String(hours).padStart(2, "0"), minutes];
};
