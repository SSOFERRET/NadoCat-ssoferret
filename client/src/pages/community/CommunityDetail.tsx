import { useState } from "react";
import "../../styles/scss/pages/community/communityDetail.scss";
import useCommunity from "../../hooks/useCommunity";
import { useParams } from "react-router-dom";
import ErrorNotFound from "../../components/error/ErrorNotFound";
import PostDetail from "../../components/communityAndEvent/PostDetail";
import useCommunityComment from "../../hooks/useCommunityComment";
import CommentForm from "../../components/comment/CommentForm";
import PostMenu from "../../components/communityAndEvent/PostMenu";
import CommunityComments from "../../components/community/CommunityComments";
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

const CommunityDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const categoryId = 1;
  const { data: post, error, isLoading, removeCommunityPost } = useCommunity(postId);
  const { commentCount, addCommunityComment } = useCommunityComment(postId);
  const { dislikePost, likePost } = useLike(postId, "communityDetail");
  const [isShowMenu, setIsShowMenu] = useState(false);

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const toggleLike = () => {
    post?.liked ? dislikePost({ categoryId, postId }) : likePost({ categoryId, postId });
  };

  return (
    <div className="community-detail">
      <HeaderWithBackButton />
      <div className="category">
        <span>커뮤니티</span>
      </div>
      {isLoading && <LoadingCat />}
      {error && <ErrorNotFound />}
      {post && (
        <>
          <PostDetail post={post} commentCount={commentCount} showMenu={showMenu} toggleLike={toggleLike} />
          <CommunityComments postId={postId} />
          <CommentForm postId={postId} addComment={addCommunityComment} />
        </>
      )}

      <PostMenu
        boardType="community"
        menuType="post"
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deletePost={removeCommunityPost}
      />

      <Footer />
    </div>
  );
};

export default CommunityDetail;
