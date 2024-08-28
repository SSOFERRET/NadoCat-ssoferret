import { IMissing, IMissingReport } from "../../models/missing.model";

export const isMissing = (data: IMissing | IMissingReport): data is IMissing =>
  (data as IMissing).missingCats ? true : false;