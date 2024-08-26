import LoadingCat from "../loading/LoadingCat";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../communityAndEvent/PostEmpty";
import PostList from "../communityAndEvent/PostList";
import Spinner from "../loading/Spinner";
import useCommunities from "../../hooks/useCommunities";
import { Category } from "./HomeCommunitiesAndEvents";

interface IProps {
  category: Category;
}

const HomeCommunity = ({ category }: IProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } = useCommunities({
    sort: "likes",
    enabled: category === "community" && true,
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
        <LoadingCat />
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

export default HomeCommunity;
