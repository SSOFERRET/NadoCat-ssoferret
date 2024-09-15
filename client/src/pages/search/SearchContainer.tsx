import { useEffect, useState } from "react";
import Post from "../../components/communityAndEvent/Post";
import CatSearchList from "../../components/search/CatSearchList";
import { ISearchInfo } from "../../hooks/useSearch";
import { ICommunity } from "../../models/community.model";
import { IEvent } from "../../models/event.model";
import { categoryNames } from "./Search";
import SearchComponent from "../../components/search/SearchComponent";
import styles from "./search.module.scss";

interface IProps {
  data: ISearchInfo[];
  getTotalCount: () => number | undefined;
}

const SearchContainer = ({ data, getTotalCount }: IProps) => {
  console.log(data);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const totalCount = getTotalCount();
    setTotal(totalCount as number);
  }, [getTotalCount]);
  return (
    <div className="search-result-list">
      {/* <span className={`${styles.count} ${styles.leftMargin20}`}>
        총 검색 결과 수 - {total} 건
      </span> */}
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
                {(category.category === "communities" ||
                  category.category === "events") &&
                  category.search.map((result, idx) => (
                    <>
                      <div
                        key={result._source.postId}
                        className={styles.leftMargin12}
                      >
                        <SearchComponent
                          post={result._source as ICommunity | IEvent}
                        />
                      </div>
                      {category.totalcount.value > 1 && idx === 0 && (
                        <div className={styles.devider} />
                      )}
                      {category.totalcount.value > 2 && idx === 1 && (
                        <div className={styles.devider} />
                      )}
                    </>
                  ))}

                {/* {(category.category === "missings" ||
                  category.category === "street-cats") && (
                  <div className="search-cats-container">
                    {category.category === "missings" && (
                      <CatSearchList
                        posts={category.search}
                        category="missings"
                      />
                    )}
                    {category.category === "street-cats" && (
                      <CatSearchList
                        posts={category.search}
                        category="streetCats"
                      />
                    )}
                  </div>
                )} */}
                {category.totalcount.value > 2 && (
                  <div className={`${styles.more} ${styles.cursor}`}>
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
