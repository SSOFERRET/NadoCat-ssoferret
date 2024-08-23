import "../../styles/scss/pages/search/search.scss";
import { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import UnfindableCat from "../../assets/img/unfindableCat.png";
import Post from "../../components/communityAndEvent/Post";
import useDebounce from "../../hooks/useDebounce";
import {
  deleteAllLocalStorage,
  getLocalStorage,
  SearchKeyword,
  setLocalStorage,
} from "../../utils/localStorage/localStorage";
import RecentKeywords from "./RecentKeywords";
import { IoMdCloseCircle } from "react-icons/io";

const data = [
  {
    postId: 15,
    categoryId: 2,
    title: "1",
    content: "1",
    views: 0,
    createdAt: "2024-08-22T00:24:14.000Z",
    updatedAt: "2024-08-22T00:24:14.000Z",

    tags: [
      {
        tagId: 1,
        tag: "태그야 잘되니..?",
      },
      {
        tagId: 2,
        tag: "이게 맞나..",
      },
    ],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 17,
    categoryId: 2,
    title: "1",
    content: "1",
    views: 0,
    createdAt: "2024-08-22T00:24:20.000Z",
    updatedAt: "2024-08-22T00:24:20.000Z",

    tags: [],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 18,
    categoryId: 2,
    title: "1",
    content: "1",
    views: 0,
    createdAt: "2024-08-22T00:55:09.000Z",
    updatedAt: "2024-08-22T00:55:09.000Z",

    tags: [
      {
        tagId: 3,
        tag: "태그",
      },
      {
        tagId: 4,
        tag: "동네 고양이",
      },
    ],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 21,
    categoryId: 2,
    title: "22",
    content: "22",
    views: 0,
    createdAt: "2024-08-22T13:02:53.000Z",
    updatedAt: "2024-08-22T13:02:53.000Z",

    tags: [],
    thumbnail: "",
    likes: 1,
  },
  {
    postId: 22,
    categoryId: 2,
    title: "1",
    content: "1",
    views: 0,
    createdAt: "2024-08-22T13:35:43.000Z",
    updatedAt: "2024-08-22T13:35:43.000Z",

    tags: [],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 23,
    categoryId: 2,
    title: "111",
    content: "1111",
    views: 0,
    createdAt: "2024-08-22T13:58:37.000Z",
    updatedAt: "2024-08-22T13:58:37.000Z",
    tags: [],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 24,
    categoryId: 2,
    title: "1111111",
    content: "11111111111",
    views: 0,
    createdAt: "2024-08-22T14:00:51.000Z",
    updatedAt: "2024-08-22T14:00:51.000Z",
    tags: [],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 25,
    categoryId: 2,
    title: "1111111",
    content: "11111111111",
    views: 0,
    createdAt: "2024-08-22T14:00:52.000Z",
    updatedAt: "2024-08-22T14:00:52.000Z",
    tags: [],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 26,
    categoryId: 2,
    title: "1111111",
    content: "11111111111",
    views: 0,
    createdAt: "2024-08-22T14:00:52.000Z",
    updatedAt: "2024-08-22T14:00:52.000Z",
    tags: [],
    thumbnail: "",
    likes: 0,
  },
  {
    postId: 27,
    categoryId: 2,
    title: "1111111",
    content: "11111111111",
    views: 0,
    createdAt: "2024-08-22T14:00:52.000Z",
    updatedAt: "2024-08-22T14:00:52.000Z",
    tags: [],
    thumbnail: "",
    likes: 0,
  },
];

// NOTE 이건 지우면 아래 카테고리가 동작 안해용..
const categories = [
  { id: 0, category: "전체" },
  { id: 1, category: "커뮤니티" },
  { id: 2, category: "이벤트" },
  { id: 3, category: "실종고양이" },
  { id: 4, category: "동네고양이" },
];

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

  // NOTE 일단은 넣어뒀는데 이게 검색어를 입력하는 동시에 관련된 서버 요청을 한다면 사용하면 될 것 같습니다.
  // NOTE (버튼 클릭해서 조회하는게 아닌 경우, 예를 들면 마켓컬리 앱에서 검색할때 느낌? 마켓컬리는 검색 버튼을 누르기전에 검색어와 관련된 상품이 있는지 상품 이름을 먼저 보여줍니다.)
  const debouncedKeyword = useDebounce(keyword);
  const [isRecentKeywords, setIsRecentKeywords] = useState(true); // 최근 검색어 보여줄지 결정하는 요소

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

    if (keyword.trim() === "") {
      return;
    }

    setIsRecentKeywords(false);

    setRecentKeywords([...recentKeywords, { id: Date.now(), keyword }]);
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

  useEffect(() => {
    setLocalStorage(recentKeywords);
  }, [recentKeywords]);

  // NOTE 백버튼 헤더로 변경하셔야 합니다.
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
              console.log("???");
              setKeyword("");
              setIsRecentKeywords(true);
            }}
            className={`delete-input-value ${keyword.length ? "" : "hidden"}`}
          >
            <IoMdCloseCircle />
          </button>
          <button className="search-button">
            <RiSearchLine />
          </button>
        </div>
      </form>

      {isRecentKeywords && (
        <RecentKeywords
          recentKeywords={recentKeywords}
          deleteAll={deleteAllRecentKeyword}
          deleteRecentKeyword={deleteRecentKeyword}
        />
      )}

      {/* 일단은 이렇게 해놨는데 필요에 따라 조건을 수정하면 됩니다. */}
      {/* {data ? (
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
            <span className="search-result-count">검색 결과 수 보여주는 자리</span>
            <ul>
              {data.map((post) => (
                <Post key={post.postId} post={post} />
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="search-no-results">
          <img className="unfindable-cat" src={UnfindableCat} alt="UnfindableCat" />
          <span>검색 결과가 없습니다.</span>
        </section>
      )} */}
    </div>
  );
};

export default Search;
