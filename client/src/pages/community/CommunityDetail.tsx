import "../../styles/css/pages/community/communityDetail.css";
import CommunityComments from "../../components/community/CommunityComments";
import useCommunity from "../../hooks/useCommunity";
import { useParams } from "react-router-dom";
import ErrorNotFound from "../../components/error/ErrorNotFound";
import PostDetail from "../../components/community/PostDetail";
import { Suspense } from "react";

// CHECKLIST
// [x] 댓글 컴포넌트 분리
// [ ] 댓글 수 동적으로..
// [ ] 이미지 캐러셀로

const CommunityDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, error, isLoading } = useCommunity(postId);

  return (
    <div className="community-detail">
      <div className="category">
        <span>커뮤니티</span>
      </div>
      {isLoading && <div>loading...</div>}
      {error && <ErrorNotFound />}
      {post && (
        <Suspense fallback={<div>loading...</div>}>
          <PostDetail post={post} />
          <CommunityComments postId={postId} />
        </Suspense>
      )}
    </div>
  );
};

export default CommunityDetail;
