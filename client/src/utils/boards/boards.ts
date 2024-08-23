export type BoardType = "community" | "event" | "streetCat" | "missing" | "missingReport";

export const getPostPath = (boardType: BoardType) => {
  switch (boardType) {
    case "community":
      return `/boards/communities`;
    case "event":
      return `/boards/events`;
    case "streetCat":
      return `/boards/street-cats`;
    case "missing":
      return `/boards/missings`;
    case "missingReport":
      return `/boards/missings`;
    default:
      throw new Error(`일치하는 boardType이 없음: ${boardType}`);
  }
};
