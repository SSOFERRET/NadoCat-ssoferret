import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/scss/components/comment/commentForm.scss";
// import { AiFillHeart } from "react-icons/ai";
import { ICreateCommentParams } from "../../hooks/useStreetCatComments";
import { useAuthStore } from "../../store/userStore";
import { Buffer } from "buffer";

interface IProps {
  postId: number;
  addComment: ({ postId, comment }: ICreateCommentParams) => Promise<void>;
}

const CommentForm = ({ postId, addComment }: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [comment, setComment] = useState("");
  const { uuid /*, isLoggedIn*/ } = useAuthStore();

  function uuidToBuffer(uuid: string): Buffer {
    const hex = uuid.replace(/-/g, "");
    return Buffer.from(hex, "hex");
  }

  if (typeof window !== "undefined") {
    (window as any).Buffer = Buffer;
  }

  const uuidBuffer = uuidToBuffer(uuid);

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

    addComment({ postId, uuid: uuidBuffer, comment });
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
