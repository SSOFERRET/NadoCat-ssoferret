// import { useEffect, useState } from "react";
// import Post from "../../components/communityAndEvent/Post";
import { ISearchInfo } from "../../hooks/useSearch";
import { categories, categoryNames } from "./Search";
import SearchComponent from "../../components/search/SearchComponent";
import styles from "./search.module.scss";

interface IProps {
  data: ISearchInfo[];
  handleCategory: (id: number) => void;
}

const SearchContainer = ({ data, handleCategory }: IProps) => {
  return (
    <div className="search-result-list">
      <ul className="total-results">
        {data.map((category) => (
          <li key={category.category} className={styles.categoryContainer}>
            <span className={`${styles.count} ${styles.leftMargin12}`}>
              {`${
                categoryNames[category.category as keyof typeof categoryNames]
              } ${category.totalcount.value} 건`}
            </span>
            <div className={styles.devider} />
            {category.search.length === 0 ? (
              <span className={styles.more}>검색 결과가 없습니다.</span>
            ) : (
              <div>
                {category.search.map((result, idx) => (
                  <>
                    <div
                      key={result._source.postId}
                      className={styles.leftMargin12}
                    >
                      <SearchComponent post={result._source} />
                    </div>
                    {category.totalcount.value > 1 && idx === 0 && (
                      <div className={styles.devider} />
                    )}
                    {category.totalcount.value > 2 && idx === 1 && (
                      <div className={styles.devider} />
                    )}
                  </>
                ))}

                {category.totalcount.value > 2 && (
                  <div
                    className={`${styles.more} ${styles.cursor}`}
                    onClick={() =>
                      handleCategory(
                        categories.indexOf(categoryNames[category.category])
                      )
                    }
                  >
                    <span>검색 결과 더 보기 →</span>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchContainer;
