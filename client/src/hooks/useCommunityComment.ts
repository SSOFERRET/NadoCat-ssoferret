import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCommunityComment,
  deleteCommunityComment,
  getCommunityComments,
  ICommentDeleteRequest,
  ICommentPutRequest,
  updateCommunityComment,
} from "../api/community.api";

export interface ICreateCommentParams {
  postId: number;
  userId: string;
  comment: string;
}

const useCommunityComment = (postId: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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

  const { mutateAsync: addCommunityComment } = useMutation({
    mutationFn: ({ postId, userId, comment }: ICreateCommentParams) =>
      createCommunityComment({ postId, userId, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error creating community comment:", error);
    },
  });

  const { mutateAsync: editCommunityComment } = useMutation({
    mutationFn: ({ postId, userId, comment, commentId }: ICommentPutRequest) =>
      updateCommunityComment({ postId, commentId, comment, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error deleting community comment:", error);
    },
  });

  const { mutateAsync: removeCommunityComment } = useMutation({
    mutationFn: ({ postId, commentId }: ICommentDeleteRequest) => deleteCommunityComment({ postId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityComment", postId],
      });
    },
    onError: (error) => {
      console.error("Error deleting community comment:", error);
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
    addCommunityComment,
    removeCommunityComment,
    editCommunityComment,
  };
};

export default useCommunityComment;
