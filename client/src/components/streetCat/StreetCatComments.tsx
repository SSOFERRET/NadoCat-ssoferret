import { useState } from "react";
import { useStreetCatComments } from "../../hooks/useStreetCatComments";
import "../../styles/scss/pages/streetCat/streetCatDetail.scss";
import CommentsEmpty from "../comment/CommentsEmpty";
import { useIntersectionObserver } from "./IntersectionObserver";
import StreetCatCmment from "./streetCatComment";
import { AiFillHeart } from "react-icons/ai";
import CommentForm from "./CommentForm";
import PostMenu from "../communityAndEvent/PostMenu";

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
  
  console.log("streetCatComments", streetCatComments)

  if (isEmpty) {
    return ( 
    <>
      <CommentsEmpty />
      <CommentForm postId={postId} uuid={uuid} addComment={addStreetCatComment} />
    </>
    );
  }

  return (
    <>
      <div className="street-cat-comment-list">
        <StreetCatCmment comments={streetCatComments} postId={postId}/>
      </div>
      <CommentForm postId={postId} uuid={uuid} addComment={addStreetCatComment} />

      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>

    </>
  );
}

export default StreetCatComments;