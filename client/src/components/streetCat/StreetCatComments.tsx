import { useState } from "react";
import { useStreetCatComments } from "../../hooks/useStreetCatComments";
import "../../styles/scss/pages/streetCat/streetCatDetail.scss";
import CommentsEmpty from "../comment/CommentsEmpty";
import { useIntersectionObserver } from "./IntersectionObserver";
// import StreetCatComment from "./streetCatComment";
import CommentForm from "./CommentForm";
import PostMenu from "../communityAndEvent/PostMenu";
import CommentList from "../comment/CommentList";
import { ICommentPage } from "../../models/comment.model";
import { ICommentPutRequest } from "../../models/streetCat.model";

interface IProps {
  postId: number;
}

const StreetCatComments = ({ postId }: IProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
    addStreetCatComment,
    editStreetCatComment,
    removeStreetCatComment,
  } = useStreetCatComments(postId);

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isCommentEdit, setIsCommentEdit] = useState(false);

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const handelCommentFormOpen = () => {
    showMenu();
    setIsCommentEdit(true);
  };

  const transformedComments = data?.pages.map((page) => ({
    comments: page.streetCatComments,
  }));

  console.log("transformedComments ", transformedComments)

  const areAllCommentsEmpty = transformedComments?.every(
    (page) => page.comments.length === 0
  );
  if (isEmpty || areAllCommentsEmpty) {
    return (
      <>
        <CommentsEmpty />
        <CommentForm postId={postId} addComment={addStreetCatComment} />
      </>
    );
  }

  return (
    <>
      <div className="street-cat-comment-list">
        <ul>
          <CommentList
            postId={postId}
            comments={{
              pages: transformedComments as ICommentPage[],
              pageParams: [],
            }}
            showMenu={showMenu}
            isCommentEdit={isCommentEdit}
            setIsCommentEdit={setIsCommentEdit}
            editComment={editStreetCatComment}
          />
        </ul>
      </div>
      <CommentForm postId={postId} addComment={addStreetCatComment} />

      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>

      <PostMenu
        boardType="streetCat"
        menuType="comment"
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deleteComment={removeStreetCatComment}
        handelCommentFormOpen={handelCommentFormOpen}
      />
    </>
  );
};

export default StreetCatComments;
