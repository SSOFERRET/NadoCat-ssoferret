import "../../styles/scss/components/comment/comments.scss";
import useCommunityComment from "../../hooks/useCommunityComment";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import CommentList from "../comment/CommentList";
import CommentsEmpty from "../comment/CommentsEmpty";
import PostMenu from "../communityAndEvent/PostMenu";
import { useState } from "react";
import CommentError from "../comment/CommentError";
import Spinner from "../loading/Spinner";

interface IProps {
  postId: number;
}

const CommunityComments = ({ postId }: IProps) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
    removeCommunityComment,
    editCommunityComment,
  } = useCommunityComment(postId);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isCommentEdit, setIsCommentEdit] = useState(false);

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  const handelCommentFormOpen = () => {
    showMenu();
    setIsCommentEdit(true);
  };

  if (isEmpty) {
    return <CommentsEmpty />;
  }

  return (
    <>
      <section className="comment-list">
        {error && <CommentError />}

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
              editComment={editCommunityComment}
            />

            <div className="more" ref={moreRef}>
              {isFetchingNextPage && <Spinner />}
            </div>
          </>
        )}
      </section>

      <PostMenu
        boardType="community"
        menuType="comment"
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deleteComment={removeCommunityComment}
        handelCommentFormOpen={handelCommentFormOpen}
      />
    </>
  );
};

export default CommunityComments;
