// import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/scss/components/common/writeButton.scss";
import { FaPlus } from "react-icons/fa6";

const WriteButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        className="write-btn"
        onClick={() => navigate(`${location.pathname}/write`)}
      >
        <FaPlus />
        글쓰기
      </button>
    </>
  );
};

export default WriteButton;
