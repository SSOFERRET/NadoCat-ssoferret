import React from "react";
import { GoHomeFill } from "react-icons/go";
import { PiCat, PiChatCircleBold } from "react-icons/pi";
import { RiSearchLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import "../../styles/css/base/normalize.css";
import "../../styles/css/components/common/footer.css"
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <>
      <footer>
        <nav className="navbar">
          <a href="/" className="navbar-item active">
              <GoHomeFill></GoHomeFill>
              <span>홈</span>
          </a>
          <a href="/" className="navbar-item">
              <PiCat></PiCat>
              <span>카테고리</span>
          </a>
          <a href="/" className="navbar-item">
              <PiChatCircleBold></PiChatCircleBold>
              <span>채팅</span>
          </a>
          <a href="/" className="navbar-item">
              <RiSearchLine></RiSearchLine>
              <span>검색</span>
          </a>
          <a href="/" className="navbar-item">
              <FaRegUser></FaRegUser>
              <span>마이</span>
          </a>
      </nav>
      </footer>
    </>
  )
}