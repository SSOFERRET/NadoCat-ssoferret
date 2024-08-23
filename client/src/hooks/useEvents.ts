import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventPost, getEventPosts, Sort } from "../api/event.api";

const useEvents = (sort?: Sort) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["event", sort],
    queryFn: ({ pageParam = 0 }) => getEventPosts({ pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });

  const { mutateAsync: addEventPost } = useMutation({
    mutationFn: (formData: FormData) => createEventPost(formData),
    onSuccess: (post) => {
      const postId = post.postId;
      queryClient.invalidateQueries({ queryKey: ["EventDetail", postId] });
    },
    onError: (error) => {
      console.error("Error creating event post:", error);
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
    addEventPost,
  };
};

export default useEvents;
