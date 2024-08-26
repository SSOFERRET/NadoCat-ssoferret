import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventComment, deleteEventComment, getEventComments, updateEventComment } from "../api/event.api";
import { ICreateCommentParams } from "./useCommunityComment";
import { ICommentDeleteRequest, ICommentPutRequest } from "../api/community.api";

const useEventComment = (postId: number) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["eventComment", postId],
    queryFn: ({ pageParam = 0 }) => getEventComments({ pageParam, postId }),
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });

  const comments = data ? data.pages.flatMap((page) => page.comments) : [];
  const isEmpty = comments.length === 0;
  const commentCount = data?.pages.flatMap((v) => v.pagination.totalCount)[0];

  const { mutateAsync: addEventComment } = useMutation({
    mutationFn: ({ postId, userId, comment }: ICreateCommentParams) => createEventComment({ postId, userId, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error creating event comment:", error);
    },
  });

  const { mutateAsync: editEventComment } = useMutation({
    mutationFn: ({ postId, userId, comment, commentId }: ICommentPutRequest) =>
      updateEventComment({ postId, commentId, comment, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error deleting event comment:", error);
    },
  });

  const { mutateAsync: removeEventComment } = useMutation({
    mutationFn: ({ postId, commentId }: ICommentDeleteRequest) => deleteEventComment({ postId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error deleting event comment:", error);
    },
  });

  return {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
    commentCount,
    addEventComment,
    editEventComment,
    removeEventComment,
  };
};

export default useEventComment;
