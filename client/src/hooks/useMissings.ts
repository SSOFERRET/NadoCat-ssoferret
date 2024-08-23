import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createMissingPost, getMissingPosts, Sort } from "../api/missing.api";
import { queryClient } from "../api/queryClient";
import { ISubmitData } from "../components/missing/MissingEventWriteForm";

const useMissings = (sort?: Sort) => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["missing", sort],
    queryFn: ({ pageParam = 0 }) => getMissingPosts({ pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });

  const { mutateAsync: addMissingPost } = useMutation({
    mutationFn: (submitData: ISubmitData) => createMissingPost(submitData),
    onSuccess: (post) => {
      const postId = post.postId;
      queryClient.invalidateQueries({ queryKey: ["missingDetail", postId] });
    },
    onError: (error) => {
      console.error("Error creating missing post:", error);
    },
  });

  const posts = data ? data.pages.flatMap((page) => page.posts) : [];
  const isEmpty = posts.length === 0;

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
    addMissingPost
  };
};

export default useMissings;
