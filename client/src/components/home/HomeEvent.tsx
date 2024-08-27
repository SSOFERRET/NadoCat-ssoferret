import useEvents from "../../hooks/useEvents";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../communityAndEvent/PostEmpty";
import PostList from "../communityAndEvent/PostList";
import Spinner from "../loading/Spinner";
import { Category } from "./HomeCommunitiesAndEvents";

interface IProps {
  category: Category;
}

const HomeEvent = ({ category }: IProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } = useEvents({
    sort: "likes",
    enabled: category === "event" && true,
  });

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  return (
    <section className={`community-container`}>
      {isLoading ? (
        <Spinner />
      ) : (
        <section className={`community-post-list`}>
          {isEmpty && <PostEmpty />}

          {data && <PostList posts={data} />}

          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <Spinner />}
          </div>
        </section>
      )}
    </section>
  );
};

export default HomeEvent;
