import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/scss/components/comment/commentForm.scss";
import { AiFillHeart } from "react-icons/ai";
import { ICreateCommentParams } from "../../hooks/useStreetCatComments";

interface IProps {
  postId: number;
  uuid: Buffer;
  addComment: ({ postId, uuid, comment }: ICreateCommentParams) => Promise<void>;
}

const CommentForm = ({ postId, uuid, addComment }: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [comment, setComment] = useState("");

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
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

    addComment({ postId, uuid, comment })
      .then(() => {
        console.log("댓글이 성공적으로 등록되었습니다!");
        setComment("");
      })
      .catch(() => {
        console.log("댓글 등록에 실패했습니다.");
      })
      .finally(() => {
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
        <button type="submit" className="submit-btn">게시</button>
      </form>
    </section>
  );
};

export default CommentForm;
