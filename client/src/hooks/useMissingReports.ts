import { useInfiniteQuery } from "@tanstack/react-query";
import { /*getMissingPosts,*/ getMissingReportPosts/*, Sort*/ } from "../api/missing.api";

const useMissingReports = (missingId: number) => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["missingReport", missingId],
    queryFn: ({ pageParam = 0, queryKey }) => {
      const missingId = Number(queryKey[1]);
      return getMissingReportPosts({ pageParam, missingId });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pagination.nextCursor;
      return nextCursor ? nextCursor : undefined;
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
