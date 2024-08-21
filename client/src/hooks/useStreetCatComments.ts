import { fetchStreetCatComments } from "../api/streetCat.api";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 8;

export const useStreetCatComments = (postId: number) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status
  } = useInfiniteQuery({
    queryKey: ["streetCatComments"],
    queryFn: ({pageParam}) => fetchStreetCatComments({
      postId: postId,
      limit: LIMIT,
      cursor: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.streetCatComments.length < 8) {
        return undefined;
      }
      return lastPage.streetCatComments[LIMIT - 1]?.streetCatCommentId;
    },
  });

  const streetCatPosts = data ? data.pages.flatMap((page) => page?.streetCatComments) : [];
  const isEmpty = streetCatPosts.length === 0;

  return { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    streetCatPosts,
    isEmpty
  };
}