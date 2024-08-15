import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import "../../styles/css/base/reset.css";
import "../../styles/css/pages/streetCat/streetCat.css";
import { Header } from "../../components/common/Header";
import { Footer } from "../../components/common/Footer";

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
      <button className="write-btn">
        <FaPlus />
        <a href="">글쓰기</a>
      </button>

      <section className="street-cat-section">
        <nav className="street-cat-nav">
          <ul>
            <li className="active">
              <span>
                동네 고양이 도감
                <span className="nav-bar"></span>
              </span>
            </li>
            <li>
              <span>내 도감</span>
            </li>
            <li>
              <span>동네 고양이 지도</span>
            </li>
          </ul>
        </nav>

        <p className="title">우리 동네 고양이</p>

        <ul className="street-cat-list">
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
                <AiFillHeart className="active"/>
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
                <AiOutlineHeart />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
                <AiOutlineHeart />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
                <AiOutlineHeart />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
          <li className="street-cat">
            <a href="">
              <div className="test-box">
                <img src="" alt="" />
              </div>
              <div className="street-cat-info">
                <span className="name">고양이름</span>
                <span className="date">2024년 8월 10일</span>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </>
  )
}