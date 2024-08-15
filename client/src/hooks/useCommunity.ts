import { useQuery } from "@tanstack/react-query";
import { getCommunityDetail } from "../api/community.api";

const useCommunity = (postId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["communityDetail", postId],
    queryFn: () => getCommunityDetail({ postId }),
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useCommunity;
