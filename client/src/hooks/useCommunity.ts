import { getCommunityPosts } from "../api/community.api";
import { useInfiniteQuery } from "@tanstack/react-query";

const useCommunity = () => {
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["community"],
    queryFn: ({ pageParam = 0 }) => getCommunityPosts({ pageParam }),
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  };
};

export default useCommunity;
