import "../../styles/scss/pages/event/event.scss";
import useEvents from "../../hooks/useEvents";
import { useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import PostList from "../../components/communityAndEvent/PostList";
import LoadingCat from "../../components/loading/LoadingCat";
import NewPostButton from "../../components/common/NewPostButton";
import { SortMenu, sortMenu } from "../../utils/sort/sortMenu";
import PostSortMenu from "../../components/communityAndEvent/PostSortMenu";
import SortButton from "../../components/communityAndEvent/SortButton";

const Event = () => {
  const [sort, setSort] = useState<SortMenu>(sortMenu[1]);
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

  const onCloseMenu = () => {
    setIsOpenMenu(false);
  };

  const onOpenMenu = () => {
    setIsOpenMenu(true);
  };

  const handleSortMenu = (item: SortMenu) => {
    setSort(item);
    onCloseMenu();
  };

  return (
    <section className={`event-container`}>
      {isLoading ? (
        <LoadingCat />
      ) : (
        <>
          <div className="category">
            <span>이벤트 &#183; 모임</span>
            <SortButton sort={sort} onOpenMenu={onOpenMenu} isOpenMenu={isOpenMenu} />
            <PostSortMenu
              sort={sort}
              isOpenMenu={isOpenMenu}
              handleSortMenu={handleSortMenu}
              onCloseMenu={onCloseMenu}
            />
          </div>

          <div className={`event-post-list ${isOpenMenu ? "is-open" : ""}`}>
            {isEmpty && <PostEmpty />}

            {data && <PostList posts={data} />}
          </div>

          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <div>loading...</div>}
          </div>

          <NewPostButton path="/boards/events/write" />
        </>
      )}
    </section>
  );
};

export default Event;
