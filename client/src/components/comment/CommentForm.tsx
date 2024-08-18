import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/css/components/comment/commentForm.css";
import { AiFillHeart } from "react-icons/ai";
import { ICreateCommentParams } from "../../hooks/useCommunityComment";

// CHECKLIST
// [ ] 좋아요 버튼 만들기
// [ ] 댓글 달기 기능

interface IProps {
  postId: number;
  userId: string; // 버퍼일지도..? 일단 테스트를 위한 string
  addComment: ({ postId, userId, comment }: ICreateCommentParams) => void;
}

const CommentForm = ({ postId, userId, addComment }: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "rem";
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log({ postId, userId, comment: value });
    e.preventDefault();
    addComment({ postId, userId, comment: value });
    setValue("");
  };

  useEffect(() => {
    handleResizeHeight();
  }, [value]);

  return (
    <section className="comment-form-container">
      <button className="post-like">
        <AiFillHeart />
      </button>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          onChange={handleChange}
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
