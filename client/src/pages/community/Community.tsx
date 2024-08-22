import "../../styles/scss/pages/community/community.scss";
import PostList from "../../components/communityAndEvent/PostList";
import useCommunities from "../../hooks/useCommunities";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import LoadingCat from "../../components/loading/LoadingCat";
import NewPostButton from "../../components/common/NewPostButton";
import { useState } from "react";
import { SortMenu, sortMenu } from "../../utils/sort/sortMenu";
import PostSortMenu from "../../components/communityAndEvent/PostSortMenu";
import SortButton from "../../components/communityAndEvent/SortButton";
import Spinner from "../../components/loading/Spinner";

// CHECKLIST
// [x] 정렬 기준 동적으로 받아오게 수정
// [ ] 무한 스크롤 로딩 스피너 만들기

const Community = () => {
  const [sort, setSort] = useState<SortMenu>(sortMenu[1]);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } = useCommunities(sort.sortType);

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
    <section className={`community-container`}>
      {isLoading ? (
        <LoadingCat />
      ) : (
        <>
          <div className="category">
            <span>커뮤니티</span>
            <SortButton sort={sort} onOpenMenu={onOpenMenu} isOpenMenu={isOpenMenu} />
            <PostSortMenu
              sort={sort}
              isOpenMenu={isOpenMenu}
              handleSortMenu={handleSortMenu}
              onCloseMenu={onCloseMenu}
            />
          </div>

          <section className={`community-post-list ${isOpenMenu ? "is-open" : ""}`}>
            {isEmpty && <PostEmpty />}

            {data && <PostList posts={data} />}

            <div className="more" ref={moreRef}>
              {isFetchingNextPage && <Spinner />}
            </div>
          </section>

          <NewPostButton path="/boards/communities/write" />
        </>
      )}
    </section>
  );
};

export default Community;
