import { useInfiniteQuery } from "@tanstack/react-query";
import { getFriends } from "../api/friend.apit";
import { useEffect, useState } from "react";
import { IFriendPage } from "../models/friend.model";

const useFriends = () => {
  const [enabled, setEnabled] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const { data, isLoading, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: ({ pageParam = 0 }) => getFriends({ pageParam }),
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled,
  });

  useEffect(() => {
    if (data && data.pages.length > 0) {
      const all = data.pages.flatMap((group: IFriendPage) => group.follows);
      setIsEmpty(all.length === 0);
    }
  }, [data]);

  return {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
    setEnabled,
  };
};

export default useFriends;
