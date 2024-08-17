import { useQuery } from "@tanstack/react-query";
import { getEventDetail } from "../api/event.api";

const useEvent = (postId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["eventDetail", postId],
    queryFn: () => getEventDetail({ postId }),
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useEvent;
