import { useState } from "react";
import { useStreetCatComments } from "../../hooks/useStreetCatComments";
import "../../styles/scss/pages/streetCat/streetCatDetail.scss";
import CommentsEmpty from "../comment/CommentsEmpty";
import { useIntersectionObserver } from "./IntersectionObserver";
import StreetCatComment from "./streetCatComment";
import { AiFillHeart } from "react-icons/ai";
import CommentForm from "./CommentForm";
import PostMenu from "../communityAndEvent/PostMenu";
import CommentList from "../comment/CommentList";

interface IProps {
  postId: number;
}

const StreetCatComments = ({postId}: IProps) => {
  const uuid = [85, 14, 132, 0, 226, 155, 65, 212, 167, 22, 68, 102, 85, 68, 0, 0]; // NOTE: 임시 데이터

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isEmpty,
    addStreetCatComment,
    editStreetCatComment,
    removeStreetCatComment,
    streetCatComments
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

  if (isEmpty) {
    return ( 
    <>
      <CommentsEmpty />
      <CommentForm postId={postId} uuid={uuid} addComment={addStreetCatComment} />
    </>
    );
  }

  const transformedComments = data?.pages.map(page => ({
    comments: page.streetCatComments.map(comment => ({
      commentId: comment.streetCatCommentId,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      users: comment.users
    }))
  }));

  return (
    <>
      <div className="street-cat-comment-list">
        {/* <StreetCatComment comments={streetCatComments} postId={postId}/> */}
        <ul>  
          <CommentList
            postId={postId}
            comments={{pages: transformedComments, pageParams: []}}
            showMenu={showMenu}
            isCommentEdit={isCommentEdit}
            setIsCommentEdit={setIsCommentEdit}
            editComment={editStreetCatComment}
          />
        </ul>
      </div>
      <CommentForm postId={postId} uuid={uuid} addComment={addStreetCatComment} />

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
}

export default StreetCatComments;