import { useEffect, useState } from "react";
import Post from "../../components/communityAndEvent/Post";
import CatSearchList from "../../components/search/CatSearchList";
import { ISearchInfo } from "../../hooks/useSearch";
import { ICommunity } from "../../models/community.model";
import { IEvent } from "../../models/event.model";
import { categoryNames } from "./Search";
import CommunityEventSearchComponent from "../../components/search/CommunityEventSearchComponent";

interface IProps {
  data: ISearchInfo[];
  getTotalCount: () => number | undefined;
}

const SearchContainer = ({ data, getTotalCount }: IProps) => {
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const totalCount = getTotalCount();
    setTotal(totalCount as number);
  }, [getTotalCount]);
  return (
    <div className="search-result-list">
      <span className="totalcount">총 검색 결과 수 - {total} 건</span>
      <ul className="total-results">
        {data.map((category) => (
          <li key={category.category} className="category-container">
            <div className="devider" />
            <div className="category-title">
              <span className="search-result-count">
                {`${
                  categoryNames[category.category as keyof typeof categoryNames]
                } ${category.totalcount.value} 건`}
              </span>
            </div>

            {category.search.length === 0 ? (
              <span className="no-search">검색 결과가 없습니다.</span>
            ) : (
              <div className="results-container">
                {(category.category === "communities" ||
                  category.category === "events") &&
                  category.search.map((result) => (
                    <div key={result._source.postId} className="result">
                      <CommunityEventSearchComponent
                        post={result._source as any}
                      />
                    </div>
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchContainer;
