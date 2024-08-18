import { useNavigate } from "react-router-dom";
import "../../styles/css/components/communityAndEvent/postMenu.css";
import { useCallback, useEffect, useRef } from "react";

interface IProps {
  type: "게시글" | "댓글";
  postId: number;
  isShowMenu: boolean;
  showMenu: () => void;
  deletePost: ({ postId }: { postId: number }) => Promise<void>;
  updatePost?: () => Promise<void>;
}

// NOTE

const PostMenu = ({
  type,
  postId,
  isShowMenu,
  showMenu,
  deletePost,
  updatePost,
}: IProps) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLUListElement | null>(null);

  const menu = [
    { id: 1, name: `${type} 수정`, fn: updatePost },
    {
      id: 2,
      name: `${type} 삭제`,
      fn: () =>
        deletePost({ postId }).then(() => {
          showMenu();
          navigate(-1);
        }),
    },
  ];

  const handleOverlayClick = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        showMenu();
      }
    },
    [showMenu]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOverlayClick);
    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [handleOverlayClick]);

  return (
    <div className={`overlay`}>
      <ul className={`comment-menu ${isShowMenu ? "show" : ""}`} ref={modalRef}>
        {menu.map((item) => (
          <li key={item.id} onClick={item.fn}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostMenu;
