import React from "react";
import "../../styles/css/components/comment/commentsEmpty.css";
import CommentsEmptyCat from "../../assets/img/commentsEmpty.png";

const CommentsEmpty = () => {
  return (
    <div className="comments-empty">
      <img src={CommentsEmptyCat} alt="Comments Empty Cat" />
      <span>작성된 댓글이 없습니다.</span>
    </div>
  );
};

export default CommentsEmpty;
