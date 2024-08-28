import Post from "../../components/communityAndEvent/Post";
import CatSearchList from "../../components/search/CatSearchList";
import { ISearchInfo } from "../../hooks/useSearch";
import { ICommunity } from "../../models/community.model";
import { IEvent } from "../../models/event.model";
import { categoryNames } from "./Search";

interface IProps {
  data: ISearchInfo[];
  getTotalCount: () => void;
}

const SearchContainer = ({ data, getTotalCount }: IProps) => {
  const total = getTotalCount();
  return (
    <div className="search-result-list">
      <span className="search-result-count">총 검색 결과 수 - {total} 건</span>
      <ul className="total-results">
        {data.map((category) => (
          <li key={category.category} className="category-container">
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
                      <Post post={result._source as ICommunity | IEvent} />
                    </div>
                  ))}

                {(category.category === "missings" ||
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
