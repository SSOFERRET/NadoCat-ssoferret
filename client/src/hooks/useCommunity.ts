import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommunityPost,
  getCommunityDetail,
  ICommunityDetailParams,
  updateCommunityPost,
} from "../api/community.api";

const useCommunity = (postId: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["communityDetail", postId],
    queryFn: () => getCommunityDetail({ postId }),
  });

  const { mutateAsync: removeCommunityPost } = useMutation({
    mutationFn: ({ postId }: ICommunityDetailParams) => deleteCommunityPost({ postId }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["communityDetail", postId] });
    },
    onError: (error) => {
      console.error("Error deleting community post:", error);
    },
  });

  const { mutateAsync: editCommunityPost } = useMutation({
    mutationFn: ({ formData, postId }: { formData: FormData; postId: number }) =>
      updateCommunityPost({ formData, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityDetail", postId] });
    },
    onError: (error) => {
      console.error("Error updating community post:", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    removeCommunityPost,
    editCommunityPost,
  };
};

export default useCommunity;
