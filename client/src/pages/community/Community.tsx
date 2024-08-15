import React from "react";
import "../../styles/scss/pages/community/community.scss";
import CommunityList from "../../components/community/PostList";
import useCommunity from "../../hooks/useCommunity";

const Community = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCommunity();

  return (
    <div className="container">
      <div>카테고리 들어가는 자리</div>

      <CommunityList posts={data} />

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};

export default Community;
