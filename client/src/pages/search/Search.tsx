// import "../../styles/scss/pages/search/search.scss";
import styles from "./search.module.scss";
import { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import ExclamationMarkCat from "../../assets/img/exclamationMarkCat2.png";
import UnfindableCat from "../../assets/img/unfindableCat.png";
// import useDebounce from "../../hooks/useDebounce";
import {
  deleteAllLocalStorage,
  getLocalStorage,
  SearchKeyword,
  setLocalStorage,
} from "../../utils/localStorage/localStorage";
import RecentKeywords from "./RecentKeywords";
import { IoMdCloseCircle } from "react-icons/io";
import useSearch, {
  /*ISearch,*/ ISearchInfo /*TIndex*/,
} from "../../hooks/useSearch";
// import StreetCatPosts from "../../components/streetCat/StreetCatPosts";
import LoadingCat from "../../components/loading/LoadingCat";
import SearchContainer from "./SearchContainer";

const categories = [
  { id: 0, category: "전체" },
  { id: 1, category: "커뮤니티" },
  { id: 2, category: "이벤트" },
  { id: 3, category: "실종고양이" },
  { id: 4, category: "동네고양이" },
];

export const categoryNames = {
  communities: "커뮤니티",
  events: "이벤트",
  missings: "실종 고양이",
  "street-cats": "동네 고양이",
};

const Search = () => {
  const keywords = getLocalStorage();
  const [keyword, setKeyword] = useState(""); // 검색어
  const [recentKeywords, setRecentKeywords] =
    useState<SearchKeyword[]>(keywords); // 최근 검색 키워드 들어갈 자리
  const [selected, setSelected] = useState(0);
  const [enteredKeyword, setEnteredKeyword] = useState("");
  const [isRecentKeywords, setIsRecentKeywords] = useState(true); // 최근 검색어 보여줄지 결정하는 요소

  const { data, isLoading /*, error*/ } = useSearch(enteredKeyword);

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

    const foundKeyword = recentKeywords.find(
      (item) => keyword === item.keyword
    );

    if (keyword.trim() === "") {
      return;
    }

    setIsRecentKeywords(false);

    !foundKeyword &&
      setRecentKeywords([...recentKeywords, { id: Date.now(), keyword }]);

    setEnteredKeyword(keyword);
  };

  const deleteRecentKeyword = (id: number) => {
    const filtered = recentKeywords.filter((item) => item.id !== id);

    setRecentKeywords(filtered);
    setLocalStorage(filtered);
  };

  const getTotalCount = () => {
    const total = data?.reduce(
      (acc: number, current: ISearchInfo) => acc + current.totalcount.value,
      0
    );

    return total;
  };

  const deleteAllRecentKeyword = () => {
    deleteAllLocalStorage();
    setRecentKeywords([]);
  };

  const selectKeyword = (selectedKeyword: string) => {
    setKeyword("");
    setKeyword(selectedKeyword);
  };

  useEffect(() => {
    setLocalStorage(recentKeywords);
  }, [recentKeywords]);

  return (
    <div className={styles.page}>
      <div className={styles.category}>
        <span>검색</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          onChange={handleChange}
          value={keyword}
          className={styles.searchInput}
          type="text"
          placeholder="검색어를 입력해 주세요."
        />
        <div className={styles.searchInputButtons}>
          <button
            type="button"
            disabled={!keyword.length}
            onClick={() => {
              setKeyword("");
              setIsRecentKeywords(true);
            }}
            className={
              keyword.length
                ? styles.deleteInputValue
                : styles.deleteInputHidden
            }
          >
            <IoMdCloseCircle />
          </button>
          <button type="submit" className={styles.searchButton}>
            <RiSearchLine />
          </button>
        </div>
      </form>

      {isRecentKeywords && !isLoading && recentKeywords.length && (
        <RecentKeywords
          recentKeywords={recentKeywords}
          deleteAll={deleteAllRecentKeyword}
          deleteRecentKeyword={deleteRecentKeyword}
          selectKeyword={selectKeyword}
        />
      )}

      {isRecentKeywords && !isLoading && !recentKeywords.length && (
        <section className={styles.guide}>
          <img src={ExclamationMarkCat} alt="UnfindableCat" />
          <span>검색어를 입력하세요!</span>
        </section>
      )}

      {isLoading && <LoadingCat />}

      {data && !isRecentKeywords ? (
        <section className={styles.results}>
          <ul className={styles.searchCategories}>
            {categories.map((item) => (
              <li
                className={item.id === selected ? styles.selected : ""}
                key={item.id}
                onClick={() => handleCategory(item.id)}
              >
                {item.category}
              </li>
            ))}
          </ul>
          {selected === 0 && (
            <SearchContainer data={data} getTotalCount={getTotalCount} />
          )}
        </section>
      ) : (
        !isLoading && (
          <section className="search-no-results">
            {/* <img
              className="unfindable-cat"
              src={UnfindableCat}
              alt="UnfindableCat"
            />
            <span>검색 결과가 없습니다.</span> */}
          </section>
        )
      )}
    </div>
  );
};

export default Search;
