import "../../styles/scss/components/comment/comments.scss";
import useEventComment from "../../hooks/useEventComment";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import CommentsEmpty from "../comment/CommentsEmpty";
import CommentList from "../comment/CommentList";
import { useState } from "react";
import PostMenu from "../communityAndEvent/PostMenu";
import Spinner from "../loading/Spinner";
import ServerError from "../comment/CommentError";

interface IProps {
  postId: number;
}

const EventComments = ({ postId }: IProps) => {
  const {
    data,
    error,
    isLoading,
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
        {error && <ServerError text="댓글을 불러올 수 없습니다." />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <CommentList
              postId={postId}
              comments={data}
              showMenu={showMenu}
              isCommentEdit={isCommentEdit}
              setIsCommentEdit={setIsCommentEdit}
              editComment={editEventComment}
            />

            <div className="more" ref={moreRef}>
              {isFetchingNextPage && <Spinner />}
            </div>
          </>
        )}
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
