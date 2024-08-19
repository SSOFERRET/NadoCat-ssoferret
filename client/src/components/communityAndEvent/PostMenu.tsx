import { useNavigate } from "react-router-dom";
import "../../styles/css/components/communityAndEvent/postMenu.css";
import { ICommentDeleteRequest } from "../../api/community.api";

interface IProps {
  type: "post" | "comment";
  postId: number;
  commentId?: number | null;
  isShowMenu: boolean;
  showMenu: () => void;
  deletePost?: ({ postId }: { postId: number }) => Promise<void>;
  deleteComment?: ({
    postId,
    commentId,
  }: ICommentDeleteRequest) => Promise<void>;
  updatePost?: () => Promise<void>;
  updateComment?: () => Promise<void>;
}

const PostMenu = ({
  type,
  postId,
  isShowMenu,
  commentId,
  showMenu,
  deletePost,
  deleteComment,
  updatePost,
}: IProps) => {
  const navigate = useNavigate();

  const handlePostDelete = () => {
    if (!deletePost) {
      return;
    }

    deletePost({ postId }).then(() => {
      showMenu();
      navigate(-1);
    });
  };

  const handleCommentDelete = ({
    postId,
    commentId,
  }: ICommentDeleteRequest) => {
    if (!deleteComment || !commentId) {
      return;
    }

    deleteComment({ postId, commentId })
      ?.then(() => {
        console.log("댓글 삭제 완료");
      })
      .catch(() => {
        console.log("에러발생");
      })
      .finally(() => {
        console.log("마무리");
        showMenu();
      });
  };

  return (
    <div
      className={`overlay ${isShowMenu ? "visible" : "hidden"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          showMenu();
        }
      }}
    >
      <ul
        className={`comment-menu ${isShowMenu ? "show" : "hide"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            showMenu();
          }
        }}
      >
        {type === "post" && (
          <>
            <li>게시글 수정</li>
            <li onClick={handlePostDelete}>게시글 삭제</li>
          </>
        )}

        {type === "comment" && commentId && (
          <>
            <li>댓글 수정</li>
            <li onClick={() => handleCommentDelete({ postId, commentId })}>
              댓글 삭제
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default PostMenu;
