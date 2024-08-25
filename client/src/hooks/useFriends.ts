import { useInfiniteQuery } from "@tanstack/react-query";
import { getFriends } from "../api/friend.apit";

const useFriends = () => {
  const { data, isLoading, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: ({ pageParam = 0 }) => getFriends({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });

  const follows = data ? data.pages.flatMap((page) => page.follows) : [];
  const isEmpty = follows.length === 0;

  return {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
  };
};

export default useFriends;
