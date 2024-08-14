import React from "react";
import "../../styles/scss/pages/community/community.scss";
import PostList from "../../components/community/PostList";
import useCommunity from "../../hooks/useCommunity";

const Community = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCommunity();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <section className="container">
      <div className="category">
        <span>커뮤니티</span>
      </div>

      <PostList posts={data} />

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
    </section>
  );
};

export default Community;
