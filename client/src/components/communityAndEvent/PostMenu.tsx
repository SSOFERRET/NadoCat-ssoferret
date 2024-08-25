import { useNavigate } from "react-router-dom";
import "../../styles/scss/components/communityAndEvent/postMenu.scss";
import { ICommentDeleteRequest } from "../../api/community.api";
import useCommentStore from "../../store/comment";
import { BoardType, getPostPath } from "../../utils/boards/boards";
import { RxCross1 } from "react-icons/rx";

export type DeletePost = { postId: number };

type MenuType = "post" | "comment" | "user";

interface IProps {
  boardType?: BoardType;
  menuType: MenuType;
  postId?: number;
  commentId?: number | null;
  isShowMenu: boolean;
  showMenu: () => void;
  deletePost?: ({ postId }: DeletePost) => Promise<void>;
  deleteComment?: ({ postId, commentId }: ICommentDeleteRequest) => Promise<void>;
  updatePost?: () => Promise<void>;
  handelCommentFormOpen?: () => void;
  uploadImage: (file: File) => void;
  setDefaultImage: () => void;
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
  uploadImage,
  setDefaultImage
}: IProps) => {
  const navigate = useNavigate();
  const { selectedCommentId: commentId, clearSelectedCommentId } = useCommentStore();

  const handleMenu = (e: React.MouseEvent<HTMLDivElement | HTMLUListElement>) => {
    if (e.target === e.currentTarget) {
      showMenu();

      if (commentId) {
        clearSelectedCommentId();
      }
    }
  };

  const onClickCloseButton = () => {
    showMenu();
  };

  const handlePostDelete = () => {
    if (!deletePost) {
      return;
    }

    if (!postId || !boardType) {
      return;
    }

    deletePost({ postId }).then(() => {
      showMenu();
      navigate(`${getPostPath(boardType)}`);
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

  const handleUpdatePost = () => {
    if (!boardType) {
      return;
    }

    navigate(`${getPostPath(boardType)}/edit/${postId}`);
    showMenu();
  };

  const handleUploadClick = () => {
    const fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        
        if(target && target.files && target.files.length > 0) {
            const file = target.files[0];
            uploadImage(file); 
        }
    };
    fileInput.click(); 
}

const handleDefaultImageClick = () => {
    setDefaultImage();
}

const handleSetting = () => {
  navigate("/users/my/setting");
}

  return (
    <div className={`overlay ${isShowMenu ? "visible" : "hidden"}`} onClick={handleMenu}>
      <div className={`button-container ${isShowMenu ? "visible" : "hidden"}`}>
        <button className="close-button" onClick={onClickCloseButton}>
          <RxCross1 />
        </button>
      </div>

      <ul className={`menu ${isShowMenu ? "show" : "hide"}`} onClick={handleMenu}>
        {menuType === "post" && (
          <>
            <li onClick={handleUpdatePost}>
              <span>게시글 수정</span>
            </li>
            <li className="delete" onClick={handlePostDelete}>
              <span>게시글 삭제</span>
            </li>
          </>
        )}

        {menuType === "comment" && (
          <>
            <li onClick={handelUpdateComment}>
              <span>댓글 수정</span>
            </li>
            <li className="delete" onClick={() => commentId && postId && handleCommentDelete(postId, commentId)}>
              <span>댓글 삭제</span>
            </li>
          </>
        )}

        {menuType === "user" && (
          <>
            <li onClick={() => handleUploadClick()}>
              <span>사진 올리기</span>
            </li>
            <li onClick={() => handleDefaultImageClick()}>
              <span>기본 이미지로 변경</span>
            </li>
            <li onClick={() => handleSetting()}>
              <span>회원정보 수정</span>
            </li>
            <li className="logout">
              <span
                onClick={() => {
                  `로그아웃 처리 할거 넣으시면 됩니다. 근데 바로 로그아웃 되는 것 보다는 모달창 하나 띄우는게 좋을 것 같습니다.`;
                }}
              >
                로그아웃
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default PostMenu;
