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

// CHECKLIST
// [x] 댓글 컴포넌트 분리
// [x] 댓글 수 동적으로.. -> 아마도 될듯..?
// [x] 이미지 캐러셀로
// [ ] 로딩처리
// [ ] 백버튼 구현

const CommunityDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, error, isLoading, removeCommunityPost } = useCommunity(postId);
  const { commentCount, addCommunityComment } = useCommunityComment(postId);
  const [isShowMenu, setIsShowMenu] = useState(false);

  const userId = "2f4c4e1d3c6d4f28b1c957f4a8e9e76d";

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  if (error) {
    return <ErrorNotFound />;
  }

  return (
    <div className="community-detail">
      <HeaderWithBackButton />
      <div className="category">
        <span>커뮤니티</span>
      </div>
      {isLoading && <LoadingCat />}
      {post && (
        <>
          <PostDetail post={post} commentCount={commentCount} showMenu={showMenu} />
          <CommunityComments postId={postId} />
          <CommentForm postId={postId} userId={userId} addComment={addCommunityComment} />
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
    </div>
  );
};

export default CommunityDetail;
