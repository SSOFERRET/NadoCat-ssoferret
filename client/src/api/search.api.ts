// import { ISearch } from "../hooks/useSearch";
// import { httpClient } from "./http";


// export const fetchSearch = async (keyword: string): Promise<ISearch[] | undefined> => {
//   try {
//     const response = await httpClient.get(
//       `/search?query=${keyword}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch streetCatPost:", error);
//   }
// }

import { ISearch, ISearchInfo } from "../hooks/useSearch";
import { httpClient } from "./http";

export const fetchSearch = async (keyword: string): Promise<ISearchInfo[] | undefined> => {
  try {
    console.log("fetch start")
    const response = await httpClient.get(`/searches?query=${keyword}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    throw error;
  }
};
