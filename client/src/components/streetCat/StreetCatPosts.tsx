import React from "react";
import { AiFillHeart } from "react-icons/ai";
import "../../styles/css/components/streetCat/streetCatPosts.css";

const StreetCatPosts: React.FC = () => {
  return (
    <>
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
      </ul>
    </>
  )
}

export default StreetCatPosts;