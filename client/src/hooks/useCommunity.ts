import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommunityPost,
  getCommunityDetail,
  ICommunityDetailParams,
} from "../api/community.api";

const useCommunity = (postId: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["communityDetail", postId],
    queryFn: () => getCommunityDetail({ postId }),
  });

  const { mutateAsync: removeCommunityPost } = useMutation({
    mutationFn: ({ postId }: ICommunityDetailParams) =>
      deleteCommunityPost({ postId }),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["communityDetail", postId],
      // });
      queryClient.removeQueries({ queryKey: ["communityDetail", postId] });
    },
    onError: (error) => {
      console.error("Error deleting community post:", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    removeCommunityPost,
  };
};

export default useCommunity;
