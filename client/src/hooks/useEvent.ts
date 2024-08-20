import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteEventPost,
  getEventDetail,
  IEventDetailParams,
} from "../api/event.api";

const useEvent = (postId: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["eventDetail", postId],
    queryFn: () => getEventDetail({ postId }),
  });

  const { mutateAsync: removeEventPost } = useMutation({
    mutationFn: ({ postId }: IEventDetailParams) => deleteEventPost({ postId }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["eventDetail", postId] });
    },
    onError: (error) => {
      console.error("Error deleting event post:", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    removeEventPost,
  };
};

export default useEvent;
