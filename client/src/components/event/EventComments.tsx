import "../../styles/css/components/comment/comments.css";
import useEventComment from "../../hooks/useEventComment";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import CommentsEmpty from "../comment/CommentsEmpty";
import CommentList from "../comment/CommentList";
import { useState } from "react";
import PostMenu from "../communityAndEvent/PostMenu";

interface IProps {
  postId: number;
}

const EventComments = ({ postId }: IProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
    removeEventComment,
    editEventComment,
  } = useEventComment(postId);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isCommentEdit, setIsCommentEdit] = useState(false);

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const handelCommentFormOpen = () => {
    showMenu();
    setIsCommentEdit(true);
  };

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  if (isEmpty) {
    return <CommentsEmpty />;
  }

  return (
    <>
      <section className="comment-list">
        <CommentList
          postId={postId}
          comments={data}
          showMenu={showMenu}
          isCommentEdit={isCommentEdit}
          setIsCommentEdit={setIsCommentEdit}
          editComment={editEventComment}
        />

        <div className="more" ref={moreRef}>
          {isFetchingNextPage && <div>loading...</div>}
        </div>
      </section>

      <PostMenu
        boardType="event"
        menuType="comment"
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deleteComment={removeEventComment}
        handelCommentFormOpen={handelCommentFormOpen}
      />
    </>
  );
};

export default EventComments;
