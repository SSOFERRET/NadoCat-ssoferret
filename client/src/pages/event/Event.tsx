import "../../styles/scss/pages/event/event.scss";
import useEvents from "../../hooks/useEvents";
import { useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import PostList from "../../components/communityAndEvent/PostList";
import LoadingCat from "../../components/loading/LoadingCat";
import NewPostButton from "../../components/common/NewPostButton";
import { SortMenu, sortMenu } from "../../utils/sort/sortMenu";
import SortButton from "../../components/communityAndEvent/SortButton";
import Spinner from "../../components/loading/Spinner";
import PostMenu from "../../components/communityAndEvent/PostMenu";

const Event = () => {
  const [sort, setSort] = useState<SortMenu>(sortMenu[0]);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } = useEvents(sort.sortType);

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  const handleMene = () => {
    setIsOpenMenu((prev) => !prev);
  };

  const handleSortMenu = (item: SortMenu) => {
    setSort(item);
    handleMene();
  };

  return (
    <>
      <section className={`event-container`}>
        {isLoading ? (
          <LoadingCat />
        ) : (
          <>
            <div className="category">
              <span>이벤트 &#183; 모임</span>
              <SortButton sort={sort} handleMene={handleMene} />
            </div>

            <section className={`event-post-list ${isOpenMenu ? "is-open" : ""}`}>
              {isEmpty && <PostEmpty />}

              {data && <PostList posts={data} />}

              <div className="more" ref={moreRef}>
                {isFetchingNextPage && <Spinner />}
              </div>
            </section>

            <NewPostButton path="/boards/events/write" />
          </>
        )}
      </section>

      <PostMenu
        sort={sort}
        sortMenu={sortMenu}
        isShowMenu={isOpenMenu}
        menuType="sort"
        showMenu={handleMene}
        handleSortMenu={handleSortMenu}
      />
    </>
  );
};

export default Event;
