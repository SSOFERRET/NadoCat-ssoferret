import { TIndex, useCategorySearch } from "../../hooks/useSearch";
import { categoryNames } from "./Search";
import SearchComponent from "../../components/search/SearchComponent";
import styles from "./search.module.scss";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Spinner from "../../components/loading/Spinner";
import UnfindableCat from "./../../assets/img/unfindableCat.png";
import useSearchCountStore from "../../store/searchCount";

interface IProps {
  keyword: string;
  index: number;
}

const SearchCategoryContainer = ({ index, keyword }: IProps) => {
  const category = Object.keys(categoryNames)[index - 1];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategorySearch(
      category === "streetCats" ? "street-cats" : category,
      keyword
    );

  const posts = data?.pages.flatMap((page) =>
    page.posts.map((post) => post._source)
  );

  const { counts } = useSearchCountStore();
  console.log(counts);

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      <div className={styles.eachContainer}>
        <span className={`${styles.count} ${styles.leftMargin24}`}>
          {`${categoryNames[category as keyof typeof categoryNames]} ${
            counts[category as TIndex]
          }건`}
        </span>

        {counts[category as TIndex] && (
          <ul>
            {posts?.map((post, idx) => (
              <li key={idx} className={styles.eachComponent}>
                <SearchComponent post={post} />
              </li>
            ))}
          </ul>
        )}
        {!counts[category as TIndex] && (
          <div className={styles.guide}>
            <img src={UnfindableCat} alt="unfindableCat" />
            <span>검색 결과가 없습니다.</span>
          </div>
        )}
        <div className="more" ref={moreRef}>
          {isFetchingNextPage && <Spinner />}
        </div>
      </div>
    </>
  );
};

export default SearchCategoryContainer;
