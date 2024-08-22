import React, { useEffect, useState } from "react";
import "../../styles/scss/components/common/writeButton.scss";
import { FaPlus } from "react-icons/fa6";

const WriteButton = () => {
  const [btnPosition, setBtnPosition] = useState(0);

  const updateBtnPosition = () => {
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const btnHeight = 53;

    const targetPosition = scrollTop + windowHeight - 130 - btnHeight;
    setBtnPosition(targetPosition);
  };

  useEffect(() => {
    updateBtnPosition();
    window.addEventListener("scroll", updateBtnPosition);
    window.addEventListener("resize", updateBtnPosition);
  }, []);

  return (
    <>
      <button className="write-btn" style={{ top: `${btnPosition}rem` }}>
        <FaPlus />
        <a href={`${location.pathname}/write`}>글쓰기</a>
      </button>
    </>
  );
};

export default WriteButton;
