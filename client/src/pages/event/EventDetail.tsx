import { Suspense } from "react";
import "../../styles/css/pages/event/eventDetail.css";
import { useParams } from "react-router-dom";
import ErrorNotFound from "../../components/error/ErrorNotFound";
import PostDetail from "../../components/community/PostDetail";
import CommentForm from "../../components/community/CommentForm";
import useEvent from "../../hooks/useEvent";
import useEventComment from "../../hooks/useEventComment";
import EventComments from "../../components/event/EventComments";

// CHECKLIST
// [x] 댓글 컴포넌트 분리
// [x] 댓글 수 동적으로.. -> 아마도 될듯..?
// [x] 이미지 캐러셀로
// [ ] 로딩처리
// [ ] 백버튼 구현

const EventDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, error, isLoading } = useEvent(postId);
  const { commentCount } = useEventComment(postId);

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
            <PostDetail post={post} commentCount={commentCount} />
            <EventComments postId={postId} />
          </Suspense>
          <CommentForm />
        </>
      )}
    </div>
  );
};

export default EventDetail;
