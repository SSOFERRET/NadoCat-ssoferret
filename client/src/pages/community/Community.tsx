import "../../styles/scss/pages/community/community.scss";
import PostList from "../../components/communityAndEvent/PostList";
import useCommunities from "../../hooks/useCommunities";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import LoadingCat from "../../components/loading/LoadingCat";
import NewPostButton from "../../components/common/NewPostButton";

// CHECKLIST
// [ ] 정렬 기준 동적으로 받아오게 수정
// [ ] 카테고리 컴포넌트 분리
// [ ] 무한 스크롤 로딩 스피너 만들기

const Community = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } = useCommunities("views");

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  return (
    <section className="community-container">
      {isLoading ? (
        <LoadingCat />
      ) : (
        <>
          <div className="category">
            <span>커뮤니티</span>
          </div>

          {isEmpty && <PostEmpty />}

          {data && <PostList posts={data} />}

          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <div>loading...</div>}
          </div>
          <NewPostButton path="/boards/communities/write" />
        </>
      )}
    </section>
  );
};

export default Community;
