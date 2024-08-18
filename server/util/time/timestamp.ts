import { DATE } from "../../constants/date";

export const getTimestamp = () => Math.floor(Date.now() / 1000) - DATE.BASETIME;