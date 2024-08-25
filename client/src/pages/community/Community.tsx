import "../../styles/scss/pages/community/community.scss";
import PostList from "../../components/communityAndEvent/PostList";
import useCommunities from "../../hooks/useCommunities";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import LoadingCat from "../../components/loading/LoadingCat";
import NewPostButton from "../../components/common/NewPostButton";
import { useState } from "react";
import { SortMenu, sortMenu } from "../../utils/sort/sortMenu";
import SortButton from "../../components/communityAndEvent/SortButton";
import Spinner from "../../components/loading/Spinner";
import PostMenu from "../../components/communityAndEvent/PostMenu";

// CHECKLIST
// [x] 정렬 기준 동적으로 받아오게 수정
// [x] 무한 스크롤 로딩 스피너 만들기

const Community = () => {
  const [sort, setSort] = useState<SortMenu>(sortMenu[0]);
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

  const handleMene = () => {
    setIsOpenMenu((prev) => !prev);
  };

  const handleSortMenu = (item: SortMenu) => {
    setSort(item);
    handleMene();
  };

  return (
    <>
      <section className={`community-container`}>
        {isLoading ? (
          <LoadingCat />
        ) : (
          <>
            <div className="category">
              <span>커뮤니티</span>
              <SortButton sort={sort} handleMene={handleMene} />
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

export default Community;
