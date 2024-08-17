import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/css/components/comment/commentForm.css";
import { AiFillHeart } from "react-icons/ai";

// CHECKLIST
// [ ] 좋아요 버튼 만들기
// [ ] 댓글 달기 기능

const CommentForm = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "rem";
    }
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    handleResizeHeight();
  }, [value]);

  return (
    <section className="comment-form-container">
      <button className="post-like">
        <AiFillHeart />
      </button>
      <form className="comment-form">
        <textarea
          onChange={onChange}
          ref={textareaRef}
          maxLength={200}
          rows={1}
          value={value}
          placeholder="댓글 달기"
        ></textarea>
        <button className="submit-btn">게시</button>
      </form>
    </section>
  );
};

export default CommentForm;
