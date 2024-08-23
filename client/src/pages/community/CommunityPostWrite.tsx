import "../../styles/scss/pages/community/communityPostWrite.scss";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import useCommunities from "../../hooks/useCommunities";
import { useNavigate } from "react-router-dom";
import PostWriteForm from "../../components/communityAndEvent/PostWriteForm";

// CHECKLIST
// [x] 푸터 삭제
// [x] 헤더 백버튼으로 변경
// [x] 이미지 업로드 구현
// [x] 해시테크 폼 만들기
// [x] 이미지 슬라이드(?) UI 만들기
// [x] 로컬 이미지 받아오기
// [x] 로컬 이미지 UI로 보여주기
// [x] 이미지 삭제

const CommunityPostWrite = () => {
  const navigate = useNavigate();
  const { addCommunityPost } = useCommunities();

  const addPost = (formData: FormData) => {
    addCommunityPost(formData).then((data) => {
      console.log("작성 완료!");
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
