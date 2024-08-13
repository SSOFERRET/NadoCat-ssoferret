import React from "react";
import "../../styles/css/base/normalize.css";
import "../../styles/css/pages/streetCat/streetCat.css";
import { Header } from "../../components/common/Header";

// interface IStreetCatPost {
//   postId: number;
//   thumbnail: string;
//   name: string;
//   createdAt: string; // api 연결시 Date로 변경
//   streetCatFavorites: number; // TODO: api 리턴값 1 or 0으로 변경해야함
// }

// 임시 데이터
// const streetCatPost: IStreetCatPost[] = [
//   {
//     postId: 1,
//     thumbnail: "",
//     name: "테스트냥1",
//     createdAt: "2024년 8월 9일",
//     streetCatFavorites: 0,
//   },
//   {
//     postId: 2,
//     thumbnail: "",
//     name: "테스트냥2",
//     createdAt: "2024년 8월 9일",
//     streetCatFavorites: 1,
//   },
//   {
//     postId: 3,
//     thumbnail: "",
//     name: "테스트냥3",
//     createdAt: "2024년 8월 8일",
//     streetCatFavorites: 1,
//   },
//   {
//     postId: 4,
//     thumbnail: "",
//     name: "테스트냥4",
//     createdAt: "2024년 8월 6일",
//     streetCatFavorites: 0,
//   },
// ]

export const StreetCats: React.FC = () => {
  return (
    <>
      <Header />
      <h2>네비 들어갈 자리</h2>
      <main>
        <section>
          <div className="test-box">1</div>
          <div className="test-box">2</div>
          <div className="test-box">1</div>
          <div className="test-box">2</div>
          <div className="test-box">1</div>
          <div className="test-box">2</div>
        </section>
      </main>
    </>
  )
}