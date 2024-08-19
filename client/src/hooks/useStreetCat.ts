import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchStreetCatPost } from "../api/streetCat.api";
import { IStreetCatDetail } from "../models/streetCat.model";
import { queryClient } from "../api/queryClient";

export const useStreetCatPost = (postId: number) => {
  const {data} = useQuery({
    queryKey: ["streetCatDetail", postId],
    queryFn: () => fetchStreetCatPost({postId})
  });

  return {
    data
  }
}
