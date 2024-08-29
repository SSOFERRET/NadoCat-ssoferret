import "../../styles/scss/pages/community/communityPostWrite.scss";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import useCommunities from "../../hooks/useCommunities";
import { useNavigate } from "react-router-dom";
import PostWriteForm from "../../components/communityAndEvent/PostWriteForm";

const CommunityPostWrite = () => {
  const navigate = useNavigate();
  const { addCommunityPost } = useCommunities({ enabled: true });

  const addPost = (formData: FormData) => {
    addCommunityPost(formData).then((data) => {
      navigate(`/boards/communities/${data.postId}`);
    });
  };

  return (
    <div className="community-post-edit">
      <HeaderWithBackButton />

      <PostWriteForm boardCategory="community" addPost={addPost} />
    </div>
  );
};

export default CommunityPostWrite;
