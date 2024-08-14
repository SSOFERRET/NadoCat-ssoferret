import React from "react";
import "../../styles/scss/pages/community/community.scss";
import PostList from "../../components/community/PostList";
import useCommunity from "../../hooks/useCommunity";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const Community = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCommunity();

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <section className="community-container">
      <div className="category">
        <span>커뮤니티</span>
      </div>

      <PostList posts={data} />

      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>
    </section>
  );
};

export default Community;
