import "../../styles/css/pages/community/communityDetail.css";
import useCommunity from "../../hooks/useCommunity";
import { useParams } from "react-router-dom";
import ErrorNotFound from "../../components/error/ErrorNotFound";
import PostDetail from "../../components/communityAndEvent/PostDetail";
import { Suspense } from "react";
import useCommunityComment from "../../hooks/useCommunityComment";
import CommentForm from "../../components/comment/CommentForm";
import CommunityComments from "../../components/community/CommunityComments";

// CHECKLIST
// [x] 댓글 컴포넌트 분리
// [x] 댓글 수 동적으로.. -> 아마도 될듯..?
// [x] 이미지 캐러셀로
// [ ] 로딩처리
// [ ] 백버튼 구현

const CommunityDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, error, isLoading } = useCommunity(postId);
  const { commentCount, addCommunityComment } = useCommunityComment(postId);
  const userId = "2f4c4e1d3c6d4f28b1c957f4a8e9e76d";

  return (
    <div className="community-detail">
      <div className="category">
        <span>커뮤니티</span>
      </div>
      {isLoading && <div>loading...</div>}
      {error && <ErrorNotFound />}
      {post && (
        <>
          <Suspense fallback={<div>loading...</div>}>
            <PostDetail post={post} commentCount={commentCount} />
            <CommunityComments postId={postId} />
          </Suspense>
          <CommentForm
            postId={postId}
            userId={userId}
            addComment={addCommunityComment}
          />
        </>
      )}
    </div>
  );
};

export default CommunityDetail;
