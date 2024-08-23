import { useInfiniteQuery } from "@tanstack/react-query";
import { getMissingPosts, Sort } from "../api/missing.api";

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

  console.log("useMissings", {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
  })

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
