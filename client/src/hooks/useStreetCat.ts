import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFavoriteCat, deleteFavoriteCat, getStreetCatPost } from "../api/streetCat.api";
import { IStreetCatDetail } from "../models/streetCat.model";
import { queryClient } from "../api/queryClient";

export const useStreetCatPost = (postId: number) => {
  const {data} = useQuery({
    queryKey: ["streetCatDetail", postId],
    queryFn: () => getStreetCatPost({postId})
  });

  return {
    data
  }
}

export const useAddFavoriteCat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFavoriteCat,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export const useDeleteFavoriteCat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFavoriteCat,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
