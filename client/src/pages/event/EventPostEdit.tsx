import "../../styles/scss/pages/community/communityPostEdit.scss";
import useEvent from "../../hooks/useEvent";
import { useNavigate, useParams } from "react-router-dom";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import LoadingCat from "../../components/loading/LoadingCat";
import PostEditForm from "../../components/communityAndEvent/PostEditForm";

const EventPostEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const postId = Number(params.id);
  const { data: post, isLoading, editEventPost } = useEvent(postId);

  const editPost = (formData: FormData) => {
    editEventPost({ formData, postId }).then(() => {
      console.log("수정 완료!");
      navigate(`/boards/events/${postId}`);
    });
  };
  return (
    <div className="community-post-edit">
      <HeaderWithBackButton />

      {isLoading && <LoadingCat />}

      {post && <PostEditForm boardCategory="event" post={post} editPost={editPost} />}
    </div>
  );
};

export default EventPostEdit;
