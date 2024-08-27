import "../../styles/scss/pages/search/search.scss";
import { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import UnfindableCat from "../../assets/img/unfindableCat.png";
import Post from "../../components/communityAndEvent/Post";
// import useDebounce from "../../hooks/useDebounce";
import {
  deleteAllLocalStorage,
  getLocalStorage,
  SearchKeyword,
  setLocalStorage,
} from "../../utils/localStorage/localStorage";
import RecentKeywords from "./RecentKeywords";
import { IoMdCloseCircle } from "react-icons/io";
import useSearch, { /*ISearch,*/ ISearchInfo /*TIndex*/ } from "../../hooks/useSearch";
import { ICommunity } from "../../models/community.model";
import { IEvent } from "../../models/event.model";
import MissingPost from "../../components/missing/MissingPost";
import { IMissing } from "../../models/missing.model";
// import StreetCatPosts from "../../components/streetCat/StreetCatPosts";
import LoadingCat from "../../components/loading/LoadingCat";

// NOTE 이건 지우면 아래 카테고리가 동작 안해용..
const categories = [
  { id: 0, category: "전체" },
  { id: 1, category: "커뮤니티" },
  { id: 2, category: "이벤트" },
  { id: 3, category: "실종고양이" },
  { id: 4, category: "동네고양이" },
];

//opensearch 목록별 명칭
const categoryNames = {
  communities: "커뮤니티",
  events: "이벤트",
  missings: "실종 고양이",
  "street-cats": "동네 고양이",
};

// CHECKLIST
// [x] 검색어 입력 폼 만들기
// [x] 검색 목록
// [x] 최근 검색어 목록 만들기
// [x] 로컬 스토리지에 검색어 저장
// [x] 로컬 스토리지에 검색어 삭제
// [x] 검색 결과가 없을 때 보여주는 고양이 이미지 구현
// [x] 언제 최근 검색어를 보여줄것인가 구현
// [ ] 검색 API 적용

const Search = () => {
  const keywords = getLocalStorage();
  const [keyword, setKeyword] = useState(""); // 검색어
  const [recentKeywords, setRecentKeywords] = useState<SearchKeyword[]>(keywords); // 최근 검색 키워드 들어갈 자리
  const [selected, setSelected] = useState(0);
  const [enteredKeyword, setEnteredKeyword] = useState("");
  const [isRecentKeywords, setIsRecentKeywords] = useState(true); // 최근 검색어 보여줄지 결정하는 요소

  const { data, isLoading /*, error*/ } = useSearch(enteredKeyword);

  console.log("page", data);

  const handleCategory = (id: number) => {
    setSelected(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setIsRecentKeywords(true);
    }

    setKeyword(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const foundKeyword = recentKeywords.find((item) => keyword === item.keyword);

    if (keyword.trim() === "") {
      return;
    }

    setIsRecentKeywords(false);

    !foundKeyword && setRecentKeywords([...recentKeywords, { id: Date.now(), keyword }]);

    setEnteredKeyword(keyword);
  };

  const deleteRecentKeyword = (id: number) => {
    const filtered = recentKeywords.filter((item) => item.id !== id);

    setRecentKeywords(filtered);
    setLocalStorage(filtered);
  };

  const getTotalCount = () => {
    return data?.reduce((acc: number, current: ISearchInfo) => acc + current.totalcount.value, 0);
  };

  const deleteAllRecentKeyword = () => {
    deleteAllLocalStorage();
    setRecentKeywords([]);
  };

  const selectKeyword = (selectedKeyword: string) => {
    console.log(selectedKeyword);
    setKeyword("");
    setKeyword(selectedKeyword);
  };

  useEffect(() => {
    setLocalStorage(recentKeywords);
  }, [recentKeywords]);

  return (
    <div className="search-container">
      <div className="category">
        <span>검색</span>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          onChange={handleChange}
          value={keyword}
          className="search-input"
          type="text"
          placeholder="검색어를 입력해 주세요."
        />
        <div className="search-input-buttons">
          <button
            type="button"
            disabled={!keyword.length}
            onClick={() => {
              setKeyword("");
              setIsRecentKeywords(true);
            }}
            className={`delete-input-value ${keyword.length ? "" : "hidden"}`}
          >
            <IoMdCloseCircle />
          </button>
          <button type="submit" className="search-button">
            <RiSearchLine />
          </button>
        </div>
      </form>

      {isRecentKeywords && !isLoading && (
        <RecentKeywords
          recentKeywords={recentKeywords}
          deleteAll={deleteAllRecentKeyword}
          deleteRecentKeyword={deleteRecentKeyword}
          selectKeyword={selectKeyword}
        />
      )}

      {isLoading && <LoadingCat />}

      {data && !isRecentKeywords ? (
        <section className="search-results">
          <ul className="search-categories">
            {categories.map((item) => (
              <li
                className={`${item.id === selected ? "selected" : ""}`}
                key={item.id}
                onClick={() => handleCategory(item.id)}
              >
                {item.category}
              </li>
            ))}
          </ul>

          <div className="search-result-list">
            <span className="search-result-count">총 검색 결과 수 - {getTotalCount()} 건</span>
            <ul className="total-results">
              {data.map((category) => (
                <li key={category.category} className="category-container">
                  <span className="search-result-count">
                    {`${categoryNames[category.category as keyof typeof categoryNames]} ${
                      category.totalcount.value
                    } 건`}
                  </span>
                  <div className="results-container">
                    {category.search.map((result) => (
                      <div key={result._source.postId} className="result">
                        {(category.category === "communities" || category.category === "events") && (
                          <Post post={result._source as ICommunity | IEvent} />
                        )}
                        {category.category === "missings" && (
                          <MissingPost key={result._source.postId} post={result._source as IMissing} />
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="search-no-results">
          <img className="unfindable-cat" src={UnfindableCat} alt="UnfindableCat" />
          <span>검색 결과가 없습니다.</span>
        </section>
      )}
    </div>
  );
};

export default Search;
