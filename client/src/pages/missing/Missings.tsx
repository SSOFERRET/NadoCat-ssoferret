import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import PostList from "../../components/communityAndEvent/PostList";
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
  console.log("페이지", data);

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
        <>
          <div className="category">
            <span>실종 고양이</span>
          </div>

          {isEmpty && <PostEmpty />}

          {data && <PostList posts={data} />}

          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <div>loading...</div>}
          </div>
        </>
      )}
    </section>
  );
};

export default Missings;
