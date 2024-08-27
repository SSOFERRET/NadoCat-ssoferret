import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createMissingPost, getMissingPosts, Sort } from "../api/missing.api";
import { queryClient } from "../api/queryClient";

const useMissings = (sort?: Sort) => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["missing", sort],
    queryFn: ({ pageParam = 0 }) => getMissingPosts({ pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });


  const posts = data ? data.pages.flatMap((page) => page.posts) : [];
  const isEmpty = posts.length === 0;

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
  };
};

export default useMissings;
