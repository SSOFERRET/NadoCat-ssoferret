import "../../styles/css/components/comment/comments.css";
import useCommunityComment from "../../hooks/useCommunityComment";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import CommentList from "../comment/CommentList";
import CommentsEmpty from "../comment/CommentsEmpty";
import PostMenu from "../communityAndEvent/PostMenu";
import { useState } from "react";

interface IProps {
  postId: number;
}

const CommunityComments = ({ postId }: IProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
    removeCommunityComment,
  } = useCommunityComment(postId);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [commentId, setCommentId] = useState<number | null>(null);

  const showMenu = () => {
    console.log("설마..?");
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

  const getCommentId = (commentId: number) => {
    setCommentId(commentId);
  };

  if (isEmpty) {
    return <CommentsEmpty />;
  }

  console.log(isShowMenu);
  return (
    <>
      <section className="comment-list">
        <CommentList
          comments={data}
          getCommentId={getCommentId}
          showMenu={showMenu}
        />

        <div className="more" ref={moreRef}>
          {isFetchingNextPage && <div>loading...</div>}
        </div>
      </section>

      <PostMenu
        type="comment"
        postId={postId}
        commentId={commentId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deleteComment={removeCommunityComment}
        // updatePost={}
      />
    </>
  );
};

export default CommunityComments;
