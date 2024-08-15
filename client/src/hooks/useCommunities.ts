import { getCommunityPosts, Sort } from "../api/community.api";
import { useInfiniteQuery } from "@tanstack/react-query";

const useCommunities = (sort?: Sort) => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["community", sort],
    queryFn: ({ pageParam = 0 }) => getCommunityPosts({ pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  };
};

export default useCommunities;
