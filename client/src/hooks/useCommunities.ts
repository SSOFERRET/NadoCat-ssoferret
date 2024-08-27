import { createCommunityPost, getCommunityPosts, Sort } from "../api/community.api";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface IProps {
  sort?: Sort;
  enabled: boolean;
}

const useCommunities = ({ sort = "latest", enabled }: IProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["community", sort],
    queryFn: ({ pageParam = 0 }) => getCommunityPosts({ pageParam, sort }),
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  const posts = data ? data.pages.flatMap((page) => page.posts) : [];
  const isEmpty = posts.length === 0;

  const { mutateAsync: addCommunityPost } = useMutation({
    mutationFn: (formData: FormData) => createCommunityPost(formData),
    onSuccess: (post) => {
      const postId = post.postId;
      queryClient.invalidateQueries({ queryKey: ["communityDetail", postId] });
    },
    onError: (error) => {
      console.error("Error creating community post:", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
    addCommunityPost,
  };
};

export default useCommunities;
