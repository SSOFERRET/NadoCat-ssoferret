import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLike, deleteLike, ILike } from "../api/like.api";

type CategoryType = "eventDetail" | "communityDetail";

const useLike = (postId: number, categoryType: CategoryType) => {
  const queryClient = useQueryClient();
  const queryKey = [categoryType, postId];

  const { mutateAsync: dislikePost } = useMutation({
    mutationFn: ({ categoryId, postId }: ILike) => deleteLike({ categoryId, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Error deleting like post:", error);
    },
  });

  const { mutateAsync: likePost } = useMutation({
    mutationFn: ({ categoryId, postId }: ILike) => addLike({ categoryId, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Error adding like post :", error);
    },
  });

  return { dislikePost, likePost };
};

export default useLike;
