import { useState } from "react";
import "../../styles/scss/pages/event/eventDetail.scss";
import { useParams } from "react-router-dom";
import ErrorNotFound from "../../components/error/ErrorNotFound";
import PostDetail from "../../components/communityAndEvent/PostDetail";
import CommentForm from "../../components/comment/CommentForm";
import useEvent from "../../hooks/useEvent";
import useEventComment from "../../hooks/useEventComment";
import EventComments from "../../components/event/EventComments";
import PostMenu from "../../components/communityAndEvent/PostMenu";
import LoadingCat from "../../components/loading/LoadingCat";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { Footer } from "../../components/common/Footer";
import useLike from "../../hooks/useLike";

// CHECKLIST
// [x] 댓글 컴포넌트 분리
// [x] 댓글 수 동적으로.. -> 아마도 될듯..?
// [x] 이미지 캐러셀로
// [x] 로딩처리
// [x] 백버튼 구현

const EventDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const categoryId = 2;
  const { data: post, error, isLoading, removeEventPost } = useEvent(postId);
  const { commentCount, addEventComment } = useEventComment(postId);
  const { dislikePost, likePost } = useLike(postId, "eventDetail");
  const [isShowMenu, setIsShowMenu] = useState(false);

  const userId = "2f4c4e1d3c6d4f28b1c957f4a8e9e76d";

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const toggleLike = () => {
    post?.liked ? dislikePost({ categoryId, postId }) : likePost({ categoryId, postId });
  };

  return (
    <div className="event-detail">
      <HeaderWithBackButton />
      {isLoading && <LoadingCat />}
      {error && <ErrorNotFound />}
      {post && (
        <>
          <div className="category">
            <span>이벤트 &#183; 모임</span>{" "}
            <div className="post-status">
              <span className={`is-closed ${post.isClosed ? "close" : "open"}`}>
                {post.isClosed ? "마감" : "모집중"}
              </span>
            </div>
          </div>
          <PostDetail post={post} commentCount={commentCount} showMenu={showMenu} toggleLike={toggleLike} />
          <EventComments postId={postId} />

          <CommentForm postId={postId} userId={userId} addComment={addEventComment} />
        </>
      )}

      <PostMenu
        boardType="event"
        menuType="post"
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deletePost={removeEventPost}
      />
      <Footer />
    </div>
  );
};

export default EventDetail;
