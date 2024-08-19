import React from "react";
import "../../styles/css/components/streetCat/MyStreetCatEmpty.css";
import heartCat from "../../assets/img/heartCat.png";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

const MyStreetCatEmpty: React.FC = () => {
  return (
    <>
      <p className="guide-text">
        <span className="nickname">사용자</span>님 도감에 <br/>
        동네 고양이를 등록해 보세요!
      </p>

      <div className="image-box">
        <div className="circle">
          <img src={heartCat} alt="heartCat" />
        </div>
        <button>
          <a href={location.pathname}><AiOutlinePlus /></a>
        </button>
      </div>
    </>
  )
}

export default MyStreetCatEmpty;