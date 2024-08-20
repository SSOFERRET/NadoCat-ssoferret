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
  addComment: ({
    postId,
    userId,
    comment,
  }: ICreateCommentParams) => Promise<void>;
}

const CommentForm = ({ postId, userId, addComment }: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [comment, setComment] = useState("");

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "rem";
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (comment.trim().length === 0) {
      return;
    }

    // 여기 UI로 보여주기
    addComment({ postId, userId, comment })
      .then(() => {
        console.log("댓글이 성공적으로 등록되었습니다!");
        setComment("");
      })
      .catch(() => {
        console.log("댓글 등록에 실패했습니다.");
      })
      .finally(() => {
        console.log("마무리!");
        setComment("");
      });
  };

  useEffect(() => {
    handleResizeHeight();
  }, [comment]);

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
          value={comment}
          placeholder="댓글 달기"
        ></textarea>
        <button className="submit-btn">게시</button>
      </form>
    </section>
  );
};

export default CommentForm;
