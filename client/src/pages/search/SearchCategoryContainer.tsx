import { useCategorySearch } from "../../hooks/useSearch";
import { categoryNames } from "./Search";
import SearchComponent from "../../components/search/SearchComponent";
import styles from "./search.module.scss";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Spinner from "../../components/loading/Spinner";
import UnfindableCat from "./../../assets/img/unfindableCat.png";

interface IProps {
  keyword: string;
  index: number;
}

const SearchCategoryContainer = ({ index, keyword }: IProps) => {
  const category = Object.keys(categoryNames)[index - 1];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategorySearch(category, keyword);

  // 모든 페이지의 posts를 합치기
  const posts = data?.pages.flatMap((page) =>
    page.posts.map((post) => post._source)
  );

  const totalcount = data?.pages[0].pagination.totalcount;

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <div className={styles.eachContainer}>
      <ul>
        <span className={`${styles.count} ${styles.leftMargin24}`}>
          {`${categoryNames[category as keyof typeof categoryNames]} ${
            totalcount || 0
          }건`}
        </span>
        {posts?.map((post, idx) => (
          <li key={idx} className={styles.eachComponent}>
            <SearchComponent post={post} />
            <div className={styles.devider} />
          </li>
        ))}
      </ul>
      {!totalcount && (
        <div className={styles.guide}>
          <img src={UnfindableCat} alt="unfindableCat" />
          <span>검색 결과가 없습니다.</span>
        </div>
      )}
      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
};

export default SearchCategoryContainer;
