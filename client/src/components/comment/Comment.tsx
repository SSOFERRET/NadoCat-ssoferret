import "../../styles/scss/components/comment/comment.scss";
import Avatar from "../common/Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IComment } from "../../models/comment.model";
import { formatAgo } from "../../utils/format/format";
import useCommentStore from "../../store/comment";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ICommentPutRequest } from "../../api/community.api";
import { useAuthStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

interface IProps {
  postId: number;
  comment: IComment;
  showMenu: () => void;
  isCommentEdit: boolean;
  setIsCommentEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editComment: ({ postId, userId, comment, commentId }: ICommentPutRequest) => Promise<void>;
}

const Comment = ({ postId, comment, showMenu, isCommentEdit, setIsCommentEdit, editComment }: IProps) => {
  const navigate = useNavigate();
  const oldComment = comment.comment;
  const { selectedCommentId, setSelectedCommentId, clearSelectedCommentId } = useCommentStore();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [commentText, setCommentText] = useState(oldComment);
  const { uuid, isLoggedIn } = useAuthStore();

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleComment = (commentId: number) => {
    setSelectedCommentId(commentId);
    showMenu();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    const lines = (text.match(/\n/g) || []).length;
    if (lines > 6) {
      return;
    }

    setCommentText(text);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      navigate("/users/login");
    }

    if (!commentText.trim().length || comment.comment === commentText) {
      return;
    }

    editComment({
      postId,
      userId: uuid,
      comment: commentText,
      commentId: comment.commentId,
    })
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsCommentEdit(false);
        clearSelectedCommentId();
      });
  };

  const onClose = () => {
    setIsCommentEdit(false);
    clearSelectedCommentId();
    setCommentText(oldComment);
  };

  useEffect(() => {
    handleResizeHeight();

    return () => {
      handleResizeHeight();
    };
  }, [commentText, showMenu]);

  //Avatar클릭 시 동작 정의
  const handleAvatarClick = async () => {
    if (comment.users.uuid === uuid) {
      navigate("/users/my");
    } else {
      navigate(`/users/user/${comment.users.uuid}`); //사용자 페이지 이동
    }
  };

  const canShowOptionsIcon = uuid === comment.users.uuid;
  const isEditingCurrentComment = selectedCommentId === comment.commentId;
  const showOptionsIcon = canShowOptionsIcon && !isEditingCurrentComment && !isCommentEdit;

  useEffect(() => {
    if (isCommentEdit) {
      textareaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCommentEdit]);

  return (
    <li className="comment-card">
      <div className="comment">
        <Avatar
          profileImage={comment.users.profileImage}
          nickname={comment.users.nickname}
          onClick={handleAvatarClick}
        />

        <div className="detail">
          <div className="comment-info">
            <span className="nickname">{comment.users.nickname}</span>
            <span className="date">{formatAgo(comment.updatedAt)}</span>
            {showOptionsIcon && (
              <HiOutlineDotsVertical className="options-icon" onClick={() => handleComment(comment.commentId)} />
            )}
          </div>

          {isEditingCurrentComment && isCommentEdit ? (
            <div className="comment-edit-form-container">
              <form onSubmit={handleSubmit} className="comment-edit-form">
                <div className="textarea-container">
                  <textarea
                    ref={textareaRef}
                    onChange={handleChange}
                    value={commentText}
                    maxLength={200}
                    placeholder="댓글 달기"
                    minLength={1}
                    required
                  ></textarea>
                </div>
                <div className="buttons">
                  <button type="submit" className="edit-btn">
                    수정
                  </button>
                  <button type="button" className="close-btn" onClick={onClose}>
                    닫기
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <pre className="comment-detail">{comment.comment}</pre>
          )}
        </div>
      </div>
    </li>
  );
};

export default Comment;
