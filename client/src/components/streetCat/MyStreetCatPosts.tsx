import React from "react";
import "../../styles/scss/components/streetCat/MyStreetCatPosts.scss";
import { AiFillHeart } from "react-icons/ai";
import MyStreetCatEmpty from "./MyStreetCatEmpty";

interface IStreetCatPost {
  postId: number;
  thumbnail: string;
  name: string;
  createdAt: string; // api 연결시 Date로 변경
  streetCatFavorites: number; // TODO: api 리턴값 1 or 0으로 변경해야함
}

// NOTE 로그인 후 데이터 받아오기 해야함
// NOTE API 연결 해야함 (현재 뭔진 모르겠는데 서버 run 이슈있음...)
// CHECKLIST
// [ ] 로그인 후 좋아요 처리
// [ ] 좋아요 버튼 클릭시 페이지 이동하지 않게 수정
// [ ] 좋아요 버튼 클릭시 목록에서 삭제
// [ ] 페이지네이션 무한스크롤 구현
// [ ] 글쓰기 버튼 고쳐야함(css)
// [ ] 로그인 안했을때 empty 컴포넌트 return
// const testData: IStreetCatPost[] = [
//   {
//     postId: 1,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 1",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 2,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 2",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 3,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 3",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 4,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 4",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 5,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 5",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 6,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 6",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   }
// ]
const testData: IStreetCatPost[] = [];

// 임시 데이터
const nickname = "프로집사";
const catCount = 6;

const MyStreetCatPosts: React.FC = () => {
  if (testData.length) {
    return (
      <>
        <p className="guide-text">
          <span className="nickname">{nickname}</span>님 도감에는 <br />
          <span className="count">{catCount}</span>마리의 고양이가 있어요!
        </p>
        <ul className="street-cat-list">
          {testData.map((data) => (
            <li key={data.postId} className="street-cat">
              <a href={`${location.pathname}/${data.postId}`}>
                <div className="img-box">
                  <img src={data.thumbnail} />
                  <AiFillHeart
                    className={data.streetCatFavorites ? "active" : ""}
                    onClick={() => console.log("click")}
                  />
                </div>
                <div className="street-cat-info">
                  <span className="name">{data.name}</span>
                  <span className="date">{data.createdAt}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    return <MyStreetCatEmpty />;
  }
};

export default MyStreetCatPosts;
