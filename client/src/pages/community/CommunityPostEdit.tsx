import { useNavigate, useParams } from "react-router-dom";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import "../../styles/scss/pages/community/communityPostEdit.scss";
import useCommunity from "../../hooks/useCommunity";
import LoadingCat from "../../components/loading/LoadingCat";
import PostEditForm from "../../components/communityAndEvent/PostEditForm";

const CommunityPostEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, isLoading, editCommunityPost } = useCommunity(postId);

  const editPost = (formData: FormData) => {
    editCommunityPost({ formData, postId }).then(() => {
      console.log("수정 완료!");
      navigate(`/boards/communities/${postId}`);
    });
  };

  return (
    <div className="community-post-edit">
      <HeaderWithBackButton />

      {isLoading && <LoadingCat />}

      {post && <PostEditForm post={post} editPost={editPost} />}
    </div>
  );
};

export default CommunityPostEdit;
