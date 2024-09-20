// import "../../styles/scss/pages/search/search.scss";
import styles from "./search.module.scss";
import { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import ExclamationMarkCat from "../../assets/img/exclamationMarkCat2.png";
// import UnfindableCat from "../../assets/img/unfindableCat.png";
// import useDebounce from "../../hooks/useDebounce";
import {
  deleteAllLocalStorage,
  getLocalStorage,
  SearchKeyword,
  setLocalStorage,
} from "../../utils/localStorage/localStorage";
import RecentKeywords from "./RecentKeywords";
import { IoMdCloseCircle } from "react-icons/io";
import { useSearch } from "../../hooks/useSearch";
// import StreetCatPosts from "../../components/streetCat/StreetCatPosts";
import LoadingCat from "../../components/loading/LoadingCat";
import SearchContainer from "./SearchContainer";
import SearchCategoryContainer from "./SearchCategoryContainer";
import useSearchCountStore from "../../store/searchCount";

export const categories = [
  "전체",
  "커뮤니티",
  "이벤트",
  "실종고양이",
  "동네고양이",
];

export const categoryNames = {
  communities: "커뮤니티",
  events: "이벤트",
  missings: "실종고양이",
  streetCats: "동네고양이",
};

const Search = () => {
  const keywords = getLocalStorage();
  const [keyword, setKeyword] = useState("");
  const [recentKeywords, setRecentKeywords] =
    useState<SearchKeyword[]>(keywords);
  const [selected, setSelected] = useState(0);
  const [enteredKeyword, setEnteredKeyword] = useState("");
  const [isRecentKeywords, setIsRecentKeywords] = useState(true);

  const { data, isLoading /*, error*/ } = useSearch(enteredKeyword);

  const { setCounts } = useSearchCountStore();

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

  useEffect(() => {
    data &&
      setCounts({
        communities: Number(data[0].totalcount.value),
        events: Number(data[1].totalcount.value),
        missings: Number(data[2].totalcount.value),
        streetCats: 0,
      });
  }, [data]);

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
            {categories.map((item, idx) => (
              <li
                className={idx === selected ? styles.selected : ""}
                key={idx}
                onClick={() => handleCategory(idx)}
              >
                {item}
              </li>
            ))}
          </ul>
          {selected === 0 ? (
            <SearchContainer data={data} handleCategory={handleCategory} />
          ) : (
            <SearchCategoryContainer keyword={keyword} index={selected} />
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
