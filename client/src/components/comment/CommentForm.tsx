import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/scss/components/comment/commentForm.scss";
import { ICreateCommentParams } from "../../hooks/useCommunityComment";
import { useAuthStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

// CHECKLIST
// [x] 댓글 달기 기능

interface IProps {
  postId: number;
  addComment: ({ postId, userId, comment }: ICreateCommentParams) => Promise<void>;
}

const CommentForm = ({ postId, addComment }: IProps) => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [comment, setComment] = useState("");
  const { uuid, isLoggedIn } = useAuthStore();

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

    // NOTE isLoggedIn를 여기서 불러야 하나..?

    if (!isLoggedIn) {
      navigate("/users/login");
      return;
    }

    if (comment.trim().length === 0) {
      return;
    }

    // 여기 UI로 보여주기
    addComment({ postId, userId: uuid, comment })
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

    return () => {
      handleResizeHeight();
    };
  }, [comment]);

  return (
    <section className="comment-form-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="textarea-container">
          <textarea
            onChange={handleChange}
            ref={textareaRef}
            maxLength={200}
            rows={1}
            value={comment}
            placeholder="댓글 달기"
          ></textarea>
        </div>
        <div className="submit-btn-container">
          <button className="submit-btn">게시</button>
        </div>
      </form>
    </section>
  );
};

export default CommentForm;
