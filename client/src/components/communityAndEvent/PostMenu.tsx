import { useNavigate } from "react-router-dom";
import "../../styles/scss/components/communityAndEvent/postMenu.scss";
import { ICommentDeleteRequest } from "../../api/community.api";
import useCommentStore from "../../store/comment";
import { BoardType, getPostPath } from "../../utils/boards/boards";
import { RxCross1 } from "react-icons/rx";
import { SortMenu } from "../../utils/sort/sortMenu";
import { useAuthStore } from "../../store/userStore";
import CustomModal from "../user/CustomModal";
import { useState } from "react";
import { useUpdateFound } from "../../hooks/useMissing";
import { useAlertMessage } from "../../hooks/useAlertMessage";

export type DeletePost = { postId: number };

type MenuType = "post" | "comment" | "user" | "sort";

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
  sortMenu?: SortMenu[];
  handleSortMenu?: (item: SortMenu) => void;
  sort?: SortMenu;
  uploadImage?: (file: File) => void;
  setDefaultImage?: () => void;
  found?: boolean;
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
  handleSortMenu,
  sortMenu,
  sort,
  uploadImage,
  setDefaultImage,
  found,
}: IProps) => {
  const navigate = useNavigate();
  const { selectedCommentId: commentId, clearSelectedCommentId } = useCommentStore();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { storeLogout, uuid } = useAuthStore();
  const { mutate: updateFound } = useUpdateFound();
  const { showAlertMessage } = useAlertMessage();

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
        clearSelectedCommentId();
        showAlertMessage("댓글이 삭제되었습니다.");
      })
      .catch(() => {})
      .finally(() => {
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

  const handleAddMissingReport = () => {
    if (!boardType) return;

    navigate(`${getPostPath(boardType)}/${postId}/report/write`);
    showMenu();
  };

  const isPostSortMenu = menuType === "sort" && sortMenu && sort;

  const handleUploadClick = () => {
    if (uploadImage) {
      const fileInput = document.createElement("input");

      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (event) => {
        const target = event.target as HTMLInputElement;

        if (target && target.files && target.files.length > 0) {
          const file = target.files[0];
          uploadImage(file);
        }
      };
      fileInput.click();
    }
  };

  const handleDefaultImageClick = () => {
    if (setDefaultImage) {
      setDefaultImage();
    }
  };

  const handleSetting = async () => {
    if (!uuid) {
      console.error("uuid가 없습니다!");
      return;
    }

    navigate("/users/my/setting", { state: { uuid } });
  };

  const handleLogout = async () => {
    if (!uuid) {
      console.error("uuid가 없습니다!");
      return;
    }

    try {
      await storeLogout(uuid);

      navigate("/users/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      setIsOpenModal(false);
    }
  };

  const handleModalOpen = () => {
    setIsOpenModal(true);
  };

  const handleLogoutCancel = () => {
    setIsOpenModal(false);
  };

  const handleUpdateFound = () => {
    if (typeof postId !== "number") return;

    updateFound({ postId, found: true });
    navigate("/boards/missings");
  };

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
            {boardType === "missing" && !found && (
              <li onClick={handleUpdateFound}>
                <span>수색 종료</span>
              </li>
            )}
            {boardType === "missing" && (
              <li onClick={handleAddMissingReport}>
                <span>제보글 작성하기</span>
              </li>
            )}
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

        {isPostSortMenu && (
          <>
            {sortMenu.map((item) => (
              <li
                key={item.id}
                className={`${sort.name === item.name ? "seleted" : ""}`}
                onClick={() => {
                  handleSortMenu && handleSortMenu(item);
                }}
              >
                <span>{item.name}</span>
              </li>
            ))}
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
              <span onClick={handleModalOpen}>로그아웃</span>
            </li>
          </>
        )}
      </ul>
      <CustomModal
        size="sm"
        isOpen={isOpenModal}
        message={["정말 로그아웃 하시겠습니까?"]}
        buttons={[
          { label: "예", onClick: handleLogout },
          { label: "아니오", onClick: handleLogoutCancel },
        ]}
      />
    </div>
  );
};

export default PostMenu;
