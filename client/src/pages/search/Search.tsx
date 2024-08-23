import { useState } from "react";
import "../../styles/scss/pages/search/search.scss";
import { RiSearchLine } from "react-icons/ri";
import UnfindableCat from "../../assets/img/unfindableCat.png";
import Post from "../../components/communityAndEvent/Post";

// CHECKLIST
// [ ] 검색어 입력 폼 만들기
// [ ] 검색 목록

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

const categories = [
  { id: 0, category: "전체" },
  { id: 1, category: "커뮤니티" },
  { id: 2, category: "이벤트" },
  { id: 3, category: "실종고양이" },
  { id: 4, category: "동네고양이" },
];

const Search = () => {
  const [keyword, setKeyword] = useState(""); // 검색어
  const [selected, setSelected] = useState(0);

  const handleCategory = (id: number) => {
    setSelected(id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // NOTE 백버튼 헤더로 변경하셔야 합니다.
  return (
    <div className="search-container">
      <div className="category">
        <span>검색</span>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <input className="search-input" type="text" placeholder="검색어를 입력해 주세요." />
        <button className="search-button">
          <RiSearchLine />
        </button>
      </form>

      {data ? (
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
      )}
    </div>
  );
};

export default Search;
