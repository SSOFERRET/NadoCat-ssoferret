import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { IStreetCatPost } from "../models/streetCat.model";
import { fetchStreetCatPosts } from "../api/streetCat.api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const LIMIT = 8;

export const useStreetCatPosts = (enabled: boolean) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status
  } = useInfiniteQuery({
    queryKey: ["streetCatPosts"],
    queryFn: ({pageParam}) => fetchStreetCatPosts({
      limit: LIMIT,
      cursor: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.streetCatPosts.length < 8) {
        return undefined;
      }
      return lastPage.streetCatPosts[LIMIT - 1]?.postId;
    },
    enabled,
  });

  const streetCatPosts = data ? data.pages.flatMap((page) => page?.streetCatPosts) : [];
  const isEmpty = streetCatPosts.length === 0;

  return { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    streetCatPosts,
    isEmpty
  };
}