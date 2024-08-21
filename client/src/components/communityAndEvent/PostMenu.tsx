import { useNavigate } from "react-router-dom";
import "../../styles/scss/components/communityAndEvent/postMenu.scss";
import { ICommentDeleteRequest } from "../../api/community.api";
import useCommentStore from "../../store/comment";

type BoardType = "community" | "event" | "streetCat" | "missingCat";
type MenuType = "post" | "comment";
type DeletePost = { postId: number };

interface IProps {
  boardType: BoardType;
  menuType: MenuType;
  postId: number;
  commentId?: number | null;
  isShowMenu: boolean;
  showMenu: () => void;
  deletePost?: ({ postId }: DeletePost) => Promise<void>;
  deleteComment?: ({ postId, commentId }: ICommentDeleteRequest) => Promise<void>;
  updatePost?: () => Promise<void>;
  handelCommentFormOpen?: () => void;
}

const PostMenu = ({
  boardType,
  menuType,
  postId,
  isShowMenu,
  showMenu,
  deletePost,
  deleteComment,
  handelCommentFormOpen,
}: IProps) => {
  const navigate = useNavigate();
  const { selectedCommentId: commentId, clearSelectedCommentId } = useCommentStore();

  const handleMenu = (e: React.MouseEvent<HTMLDivElement | HTMLUListElement>) => {
    if (e.target === e.currentTarget) {
      showMenu();
      clearSelectedCommentId();
    }
  };

  const handlePostDelete = () => {
    if (!deletePost) {
      return;
    }

    deletePost({ postId }).then(() => {
      showMenu();
      navigate(-1);
    });
  };

  const handleCommentDelete = (postId: number, commentId: number) => {
    if (!deleteComment || !commentId) {
      return;
    }

    deleteComment({ postId, commentId })
      ?.then(() => {
        console.log("댓글 삭제 완료");
        clearSelectedCommentId();
      })
      .catch(() => {
        console.log("에러발생");
      })
      .finally(() => {
        console.log("마무리");
        showMenu();
      });
  };

  const handelUpdateComment = () => {
    if (!handelCommentFormOpen) {
      return;
    }

    handelCommentFormOpen();
  };

  // NOTE 일단은 수정 페이지로 이동하게 만들었는데 어떻게 처리할지는 고민이 필요함.
  const handleUpdatePost = () => {
    switch (boardType) {
      case "community":
        navigate(`/boards/communities/edit/${postId}`);
        showMenu();
        break;
      case "event":
        navigate(`/boards/events/edit/${postId}`);
        showMenu();
        break;
      case "streetCat":
        navigate(`/boards/street-cats/edit/${postId}`);
        showMenu();
        break;
      case "missingCat":
        navigate(`/boards/missings/edit/${postId}`);
        showMenu();
        break;
      default:
        throw new Error(`일치하는 boardType이 없음: ${boardType}`);
    }
  };

  return (
    <div className={`overlay ${isShowMenu ? "visible" : "hidden"}`} onClick={handleMenu}>
      <ul className={`comment-menu ${isShowMenu ? "show" : "hide"}`} onClick={handleMenu}>
        {menuType === "post" && (
          <>
            <li onClick={handleUpdatePost}>게시글 수정</li>
            <li className="delete" onClick={handlePostDelete}>
              게시글 삭제
            </li>
          </>
        )}

        {menuType === "comment" && (
          <>
            <li onClick={handelUpdateComment}>댓글 수정</li>
            <li className="delete" onClick={() => commentId && handleCommentDelete(postId, commentId)}>
              댓글 삭제
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default PostMenu;
