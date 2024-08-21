import { fetchStreetCatComments, createStreetCatComment, deleteStreetCatComment, updateStreetCatComment } from "../api/streetCat.api";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ICommentDeleteRequest, ICommentPutRequest } from "../models/streetCat.model";

const LIMIT = 8;

export interface ICreateCommentParams {
  postId: number;
  uuid: Buffer;
  comment: string;
}

export const useStreetCatComments = (postId: number) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: ["streetCatComments", postId],
    queryFn: ({ pageParam }) =>
      fetchStreetCatComments({
        postId: postId,
        limit: LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.streetCatComments.length < LIMIT) {
        return undefined;
      }
      return lastPage.streetCatComments[LIMIT - 1]?.streetCatCommentId;
    },
  });

  const streetCatComments = data
    ? data.pages.flatMap((page) => page?.streetCatComments)
    : [];
  const isEmpty = streetCatComments.length === 0;

  const { mutateAsync: addStreetCatComment } = useMutation({
    mutationFn: ({ postId, uuid, comment }: ICreateCommentParams) =>
      createStreetCatComment({ postId, uuid, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streetCatComments", postId],
      });
    },
    onError: (error) => {
      console.error("Error creating street cat comment:", error);
    },
  });

  // // Editing an existing comment
  // const { mutateAsync: editStreetCatComment } = useMutation({
  //   mutationFn: ({ postId, userId, comment, commentId }: ICommentPutRequest) =>
  //     updateStreetCatComment({ postId, commentId, comment, uuid }),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["streetCatComments", postId],
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Error editing street cat comment:", error);
  //   },
  // });

  const { mutateAsync: removeStreetCatComment } = useMutation({
    mutationFn: ({ postId, commentId }: ICommentDeleteRequest) =>
      deleteStreetCatComment({ postId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streetCatComments", postId],
      });
    },
    onError: (error) => {
      console.error("Error deleting street cat comment:", error);
    },
  });


  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    streetCatComments,
    isEmpty,
    addStreetCatComment,
    // editStreetCatComment,
    removeStreetCatComment,
  };
};