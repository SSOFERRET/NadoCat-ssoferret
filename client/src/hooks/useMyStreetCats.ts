import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { IStreetCatPost } from "../models/streetCat.model";
import { fetchMyStreetCatPosts } from "../api/streetCat.api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const LIMIT = 8;

export const useMyStreetCatPosts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status
  } = useInfiniteQuery({
    queryKey: ["myStreetCats"],
    queryFn: ({pageParam}) => fetchMyStreetCatPosts({
      limit: LIMIT,
      cursor: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.favoriteCatPosts.length < 8) {
        return undefined;
      }
      return lastPage.favoriteCatPosts[LIMIT - 1]?.postId;
    },
  });

  const myStreetCatPosts = data ? data.pages.flatMap((page) => page?.favoriteCatPosts) : [];
  const isEmpty = myStreetCatPosts.length === 0;

  return { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    myStreetCatPosts,
    isEmpty
  };
}