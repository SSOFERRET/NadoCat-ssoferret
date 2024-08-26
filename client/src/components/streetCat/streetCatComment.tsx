import React, { /*useRef,*/ useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
// import PostMenu from "../communityAndEvent/PostMenu";
// import { useDeleteComment } from "../../hooks/useStreetCat";
import useCommentStore from "../../store/comment";

interface IUser {
  uuid: {
    data: number[];
  };
  nickname: string;
  profileImage: string;
}

interface IComment {
  streetCatCommentId: number;
  comment: string;
  createdAt: string;
  users: IUser;
}

interface IStreetCatCmmentProps {
  comments: IComment[];
  postId: number;
}

const StreetCatComment: React.FC<IStreetCatCmmentProps> = ({
  comments,
  // postId,
}) => {
  // const oldComment = comments.comment;
  const {
    selectedCommentId,
    setSelectedCommentId /*, clearSelectedCommentId*/,
  } = useCommentStore();
  // const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // const [commentText, setCommentText] = useState(oldComment);

  // const { mutateAsync: removeComment } = useDeleteComment();
  const [isShowMenu, setIsShowMenu] = useState(false);

  const showMenu = () => {
    console.log(isShowMenu);
    setIsShowMenu((prev) => !prev);
  };

  // const handelCommentFormOpen = () => {
  //   showMenu();
  //   // setCommentText(true);
  // };

  const handleComment = (commentId: number) => {
    setSelectedCommentId(commentId);
    showMenu();
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!commentText.trim().length || comment.comment === commentText) {
  //     return;
  //   }

  //   editComment({
  //     postId,
  //     userId,
  //     comment: commentText,
  //     commentId: comment.commentId,
  //   })
  //     .then(() => {
  //       console.log("수정 완료!");
  //     })
  //     .catch(() => {
  //       console.error("에러닷..!!");
  //     })
  //     .finally(() => {
  //       setIsCommentEdit(false);
  //       clearSelectedCommentId();
  //     });
  // };

  // const onClose = () => {
  //   setIsCommentEdit(false);
  //   clearSelectedCommentId();
  //   setCommentText(oldComment);
  // };

  console.log("selectedCommentId: ", selectedCommentId);
  console.log(".........");

  return (
    <>
      {comments.map((comment) => (
        <div className="street-cat-comment" key={comment.streetCatCommentId}>
          <div className="user-img">
            <img src={comment.users.profileImage} alt="profileImage" />
          </div>
          <div className="user-info">
            <div className="user-profile">
              <span className="nickname">{comment.users.nickname}</span>
              <span className="date">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="content">{comment.comment}</p>
          </div>
          <HiOutlineDotsVertical
            className="comment-more"
            onClick={() => handleComment(comment.streetCatCommentId)}
          />
        </div>
      ))}
      {/* <PostMenu
        boardType="streetCat"
        menuType="comment"
        postId={postId}
        commentId={selectedCommentId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deleteComment={removeComment}
        handelCommentFormOpen={handelCommentFormOpen}
      /> */}
    </>
  );
};

export default StreetCatComment;
