import { Suspense, useState } from "react";
import "../../styles/css/pages/event/eventDetail.css";
import { useParams } from "react-router-dom";
import ErrorNotFound from "../../components/error/ErrorNotFound";
import PostDetail from "../../components/communityAndEvent/PostDetail";
import CommentForm from "../../components/comment/CommentForm";
import useEvent from "../../hooks/useEvent";
import useEventComment from "../../hooks/useEventComment";
import EventComments from "../../components/event/EventComments";
import PostMenu from "../../components/communityAndEvent/PostMenu";

// CHECKLIST
// [x] 댓글 컴포넌트 분리
// [x] 댓글 수 동적으로.. -> 아마도 될듯..?
// [x] 이미지 캐러셀로
// [ ] 로딩처리
// [ ] 백버튼 구현

const EventDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, error, isLoading, removeEventPost } = useEvent(postId);
  const { commentCount, addEventComment } = useEventComment(postId);
  const [isShowMenu, setIsShowMenu] = useState(false);

  const userId = "2f4c4e1d3c6d4f28b1c957f4a8e9e76d";

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  return (
    <div className="event-detail">
      <div className="category">
        <span>이벤트 &#183; 모임</span>
      </div>
      {isLoading && <div>loading...</div>}
      {error && <ErrorNotFound />}
      {post && (
        <>
          <Suspense fallback={<div>loading...</div>}>
            <PostDetail
              post={post}
              commentCount={commentCount}
              showMenu={showMenu}
            />
            <EventComments postId={postId} />
          </Suspense>
          <CommentForm
            postId={postId}
            userId={userId}
            addComment={addEventComment}
          />
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
    </div>
  );
};

export default EventDetail;
