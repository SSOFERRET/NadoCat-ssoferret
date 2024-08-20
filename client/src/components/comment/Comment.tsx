import "../../styles/css/components/comment/comment.css";
import Avartar from "../common/Avartar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IComment } from "../../models/comment.model";
import { formatAgo } from "../../utils/format/format";
import useCommentStore from "../../store/comment";
import { ChangeEvent, useState } from "react";
import { ICommentPutRequest } from "../../api/community.api";

//CHECKLIST
// [x] 회원 정보가 동일할때만 옵션 아이콘 출력
// [x] 댓글 수정 구현
// [x] 삭제 구현
// [ ] 수정, 삭제 알림 UI 구현

interface IProps {
  postId: number;
  comment: IComment;
  showMenu: () => void;
  isCommentEdit: boolean;
  setIsCommentEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editComment: ({
    postId,
    userId,
    comment,
    commentId,
  }: ICommentPutRequest) => Promise<void>;
}

const Comment = ({
  postId,
  comment,
  showMenu,
  isCommentEdit,
  setIsCommentEdit,
  editComment,
}: IProps) => {
  const { selectedCommentId, setSelectedCommentId, clearSelectedCommentId } =
    useCommentStore();
  const [commentText, setCommentText] = useState(comment.comment);
  const userId = "2f4c4e1d3c6d4f28b1c957f4a8e9e76d";

  const handleComment = (commentId: number) => {
    setSelectedCommentId(commentId);
    showMenu();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!commentText.trim().length || comment.comment === commentText) {
      return;
    }

    editComment({
      postId,
      userId,
      comment: commentText,
      commentId: comment.commentId,
    })
      .then(() => {
        console.log("수정 완료!");
      })
      .catch(() => {
        console.error("에러닷..!!");
      })
      .finally(() => {
        setIsCommentEdit(false);
        clearSelectedCommentId();
      });
  };

  const canShowOptionsIcon = userId === comment.users.uuid;
  const isEditingCurrentComment = selectedCommentId === comment.commentId;
  const showOptionsIcon =
    canShowOptionsIcon && !isEditingCurrentComment && !isCommentEdit;

  return (
    <li className="comment-card">
      <div className="comment">
        <Avartar
          profileImage={comment.users.profileImage}
          nickname={comment.users.nickname}
        />

        <div className="detail">
          <div className="comment-info">
            <span className="nickname">{comment.users.nickname}</span>
            <span className="date">{formatAgo(comment.updatedAt)}</span>
            {showOptionsIcon && (
              <HiOutlineDotsVertical
                className="options-icon"
                onClick={() => handleComment(comment.commentId)}
              />
            )}
          </div>

          {isEditingCurrentComment && isCommentEdit ? (
            <div className="comment-edit-form-container">
              <form onSubmit={handleSubmit} className="comment-edit-form">
                <textarea
                  onChange={handleChange}
                  value={commentText}
                  maxLength={200}
                  placeholder="댓글 달기"
                  minLength={1}
                  required
                ></textarea>

                <div className="buttons">
                  <button type="submit" className="edit-btn">
                    수정
                  </button>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => {
                      setIsCommentEdit(false);
                      clearSelectedCommentId();
                    }}
                  >
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
