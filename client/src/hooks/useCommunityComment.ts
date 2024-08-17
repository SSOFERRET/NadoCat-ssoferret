import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommunityComments } from "../api/community.api";

const useCommunityComment = (postId: number) => {
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["communityComment", postId],
    queryFn: ({ pageParam = 0 }) => getCommunityComments({ pageParam, postId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });

  const comments = data ? data.pages.flatMap((page) => page.comments) : [];
  const isEmpty = comments.length === 0;
  const commentCount = data?.pages.flatMap((v) => v.pagination.totalCount)[0];

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
    commentCount,
  };
};

export default useCommunityComment;
