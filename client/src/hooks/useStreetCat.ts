import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFavoriteCat, deleteFavoriteCat, deleteStreetCatComment, deleteStreetCatPost, getStreetCatPost } from "../api/streetCat.api";
import { IStreetCatDetail } from "../models/streetCat.model";
import { queryClient } from "../api/queryClient";

interface IStreetCatDetailParams {
  postId: number;
}

interface IStreetCatCommentParams {
  postId: number;
  commentId: number;
}

export const useStreetCatPost = (postId: number) => {
  const {data} = useQuery({
    queryKey: ["streetCatDetail", postId],
    queryFn: () => getStreetCatPost({postId})
  });

  return {
    data
  }
}

export const useDeleteStreetCatPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: IStreetCatDetailParams) => deleteStreetCatPost({ postId }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["deleteStreetCatDetail", postId] });
    },
    onError: (error) => {
      console.error("Error deleting street cat post:", error);
    },
  });
};

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

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: IStreetCatCommentParams) => deleteStreetCatComment({ postId, commentId }),
    onSuccess: (_, { postId, commentId }) => { 
      queryClient.removeQueries({ queryKey: ["deleteStreetCatComment", { postId, commentId }] });
    },
    onError: (error) => {
      console.error("deleteStreetCatComment :", error);
    },
  });
};