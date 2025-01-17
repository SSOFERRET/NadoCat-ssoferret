import { useNavigate } from "react-router-dom";
import "../../styles/scss/components/communityAndEvent/postMenu.scss";
import { RxCross1 } from "react-icons/rx";
import { useCompareUsers, useUpdateMatch } from "../../hooks/useMissingReport";

export type DeletePost = { postId: number };

interface IProps {
  postUser: Buffer; //제보글 쓴이
  loginUser: string; // 로그인 사용자
  ownerUser: Buffer; // 실종글 쓴이
  reportId: number;
  postId: number;
  isShowMenu: boolean;
  showMenu: () => void;
  deletePost: ({
    postId,
    reportId,
  }: {
    postId: number;
    reportId: number;
  }) => Promise<void>;
  matchState: string;
}

const MissingReportPostMenu = ({
  postUser,
  loginUser,
  ownerUser,
  postId,
  reportId,
  isShowMenu,
  showMenu,
  deletePost,
  matchState,
}: IProps) => {
  const navigate = useNavigate();
  const { mutate: updateMatch } = useUpdateMatch();
  const { isOwnerUser, isPostUser } = useCompareUsers(
    loginUser,
    ownerUser,
    postUser
  );

  const handleMenu = (
    e: React.MouseEvent<HTMLDivElement | HTMLUListElement>
  ) => {
    if (e.target === e.currentTarget) {
      showMenu();
    }
  };

  const onClickCloseButton = () => {
    showMenu();
  };

  const handleUpdatePost = () => {
    navigate(`/boards/missings/${postId}/report/${postId}/edit`);
    showMenu();
  };

  const handleMatch = () => {
    updateMatch({ postId, reportId, match: "Y" });
    showMenu();
  };

  const handleUnmatch = () => {
    updateMatch({ postId, reportId, match: "N" });
    showMenu();
  };

  const handleChecking = () => {
    updateMatch({ postId, reportId, match: "-" });
    showMenu();
  };

  const handlePostDelete = () => {
    if (!deletePost) {
      return;
    }

    if (!postId) {
      return;
    }

    deletePost({ postId, reportId }).then(() => {
      showMenu();
      navigate(`/boards/missings/${postId}`);
    });
  };

  return (
    <div
      className={`overlay ${isShowMenu ? "visible" : "hidden"}`}
      onClick={handleMenu}
    >
      <div className={`button-container ${isShowMenu ? "visible" : "hidden"}`}>
        <button className="close-button" onClick={onClickCloseButton}>
          <RxCross1 />
        </button>
      </div>

      <ul
        className={`menu ${isShowMenu ? "show" : "hide"}`}
        onClick={handleMenu}
      >
        {isOwnerUser() && (
          <>
            {matchState !== "Y" && (
              <li onClick={handleMatch}>
                <span>일치</span>
              </li>
            )}
            {matchState !== "N" && (
              <li onClick={handleUnmatch}>
                <span>불일치</span>
              </li>
            )}
            {matchState !== "-" && (
              <li onClick={handleChecking}>
                <span>확인 중</span>
              </li>
            )}
          </>
        )}
        {isPostUser() && (
          <>
            <li onClick={handleUpdatePost}>
              <span>게시글 수정</span>
            </li>
            <li className="delete" onClick={handlePostDelete}>
              <span>게시글 삭제</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MissingReportPostMenu;
