import useEvents from "../../hooks/useEvents";
import "../../styles/css/pages/event/event.css";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import PostList from "../../components/communityAndEvent/PostList";

const Event = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
  } = useEvents("views");

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  return (
    <section className="event-container">
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <div className="category">
            <span>이벤트 &#183; 모임</span>
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

export default Event;
