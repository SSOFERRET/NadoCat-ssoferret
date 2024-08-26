// import React, { useEffect, useState } from "react";
import "../../styles/scss/components/common/writeButton.scss";
import { FaPlus } from "react-icons/fa6";

const WriteButton = () => {
  return (
    <>
      <button className="write-btn">
        <FaPlus />
        <a href={`${location.pathname}/write`}>글쓰기</a>
      </button>
    </>
  );
};

export default WriteButton;
