import NewPostButton from "../../components/common/NewPostButton";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import PostList from "../../components/communityAndEvent/PostList";
// import PostMenu from "../../components/communityAndEvent/PostMenu";
// import { isMissing } from "../../components/missing/missingPost/PostHead";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import useMissings from "../../hooks/useMissings";
import "../../styles/scss/pages/missing/missing.scss";

const Missings = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
  } = useMissings();

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  return (
    <section className="missing-container">
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <div className="missing-contents">
          <div className="category">
            <span>실종 고양이</span>
          </div>

          {isEmpty && <PostEmpty />}

          {data && <PostList posts={data} />}

          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <div>loading...</div>}
          </div>

          <div className="post-button">
            <NewPostButton path="/boards/missings/write" text="실종 신고" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Missings;
