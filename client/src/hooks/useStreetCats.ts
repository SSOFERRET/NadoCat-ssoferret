import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { IStreetCatPost } from "../models/streetCat.model";
import { fetchStreetCatPosts } from "../api/streetCat.api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useStreetCatPosts = () => {
  const location = useLocation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status
  } = useInfiniteQuery({
    queryKey: ["streetCats", location.search],
    queryFn: ({pageParam}) => fetchStreetCatPosts({
      limit: 8,
      cursor: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.streetCats.length < 8) {
        return undefined;
      }
      return lastPage.streetCats[lastPage.streetCats.length - 1].postId;
    },
  });

  return { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading
  };

  // const location = useLocation();

  // const {data} = useQuery({
  //   queryKey: ["streetCats", location.search],
  //   queryFn: () => fetchStreetCatPosts({
  //     limit: 8
  //   })
  // });

  // return { 
  //   data
  // };
}