import React from "react";
import "../../styles/css/pages/community/community.css";
import PostList from "../../components/community/PostList";
import useCommunities from "../../hooks/useCommunities";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const Community = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCommunities("views");

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
