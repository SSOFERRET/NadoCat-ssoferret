import React from "react";
import "../../styles/css/pages/community/community.css";
import PostList from "../../components/community/PostList";
import useCommunities from "../../hooks/useCommunities";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

// CHECKLIST
// [ ] 정렬 기준 동적으로 받아오게 수정
// [ ] 카테고리 컴포넌트 분리
// [ ] 무한 스크롤 로딩 스피너 만들기

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
