import { useInfiniteQuery } from "@tanstack/react-query";
import { getMissingPosts, getMissingReportPosts, Sort } from "../api/missing.api";

const useMissingReports = () => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["missing"],
    queryFn: ({ pageParam = 0 }) => getMissingReportPosts({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      if (nextCursor) {
        return nextCursor;
      }
      return undefined;
    },
  });

  const posts = data ? data.pages.flatMap((page) => page.posts) : [];
  const isEmpty = posts.length === 0;

  return {
    reportsData: data,
    isReportsLoading: isLoading,
    reportsError: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isEmpty,
  };
};

export default useMissingReports;
