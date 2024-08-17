import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createEventComment, getEventComments } from "../api/event.api";
import { ICreateCommentParams } from "./useCommunityComment";

const useEventComment = (postId: number) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["eventComment", postId],
    queryFn: ({ pageParam = 0 }) => getEventComments({ pageParam, postId }),
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

  const { mutateAsync: addEventComment } = useMutation({
    mutationFn: ({ postId, userId, comment }: ICreateCommentParams) =>
      createEventComment({ postId, userId, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error creating community comment:", error);
    },
  });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
    commentCount,
    addEventComment,
  };
};

export default useEventComment;
