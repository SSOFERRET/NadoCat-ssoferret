import React from "react";
import "../../styles/scss/pages/boards/boards.scss";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const boards = [
  { to: "/boards/communities", title: "커뮤니티", description: "여러분의 다양한 이야기를 나누는 공간입니다." },
  {
    to: "/boards/events",
    title: `이벤트 · 모임`,
    description: "다양한 이벤트나 모임에 관한 이야기를 나누는 공간입니다.",
  },
  {
    to: "/boards/missings",
    title: "실종 고양이 수색",
    description: "잃어버린 고양이 정보를 공유하는 공간입니다.",
  },
  {
    to: "/boards/missing-report",
    title: "실종 고양이 제보",
    description: "잃어버린 고양이 발견 정보를 공유하는 공간입니다.",
  },
  {
    to: "/boards/street-cats",
    title: "실종 고양이 제보",
    description: "나만 없어 고양이.. 귀여운 길냥이를 공유하는 공간입니다.",
  },
];

const Boards = () => {
  const navigate = useNavigate();
  return (
    <div className="boards-container">
      <ul className="boards">
        {boards.map((item) => (
          <li key={item.title} className="board" onClick={() => navigate(item.to)}>
            <div className="board-info">
              <span className="title">{item.title}</span>
              <span className="description">{item.description}</span>
            </div>
            <IoIosArrowForward />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Boards;
