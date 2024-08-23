import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMissingPost, getMissingDetail, IMissingDetailParam } from "../api/missing.api";


const useMissing = (postId: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["missingDetail", postId],
    queryFn: () => getMissingDetail({ postId }),
  });

  const { mutateAsync: removeMissingPost } = useMutation({
    mutationFn: ({ postId }: IMissingDetailParam) => deleteMissingPost({ postId }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["missingDetail", postId] });
    },
    onError: (error) => {
      console.error("Error deleting Missing post:", error);
    },
  });

  // const { mutateAsync: editMissingPost } = useMutation({
  //   mutationFn: ({ formData, postId }: { formData: FormData; postId: number }) =>
  //     updateMissingPost({ formData, postId }),
  //   // onSuccess: () => {
  //   //   queryClient.invalidateQueries({ queryKey: ["MissingDetail", postId] });
  //   // },
  //   onError: (error) => {
  //     console.error("Error updating Missing post:", error);
  //   },
  // });

  return {
    data,
    isLoading,
    error,
    removeMissingPost,
    // editMissingPost,
  };
};

export default useMissing;
