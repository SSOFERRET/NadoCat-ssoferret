import { useNavigate, useParams } from "react-router-dom";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import LoadingCat from "../../components/loading/LoadingCat";
import useMissing from "../../hooks/useMissing";
import MissingPostEditForm from "../../components/missing/MissingPostEditForm";
import { IMissing } from "../../models/missing.model";

const MissingPostEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const postId = Number(id);
  const { data: post, editMissingPost } = useMissing(postId);

  const handleFormSubmit = async (formData: FormData) => {
    await editMissingPost({ formData, postId });
    navigate(`/boards/missings/${id}`);
  };

  return (
    <>
      <HeaderWithBackButton />
      {/* {isLoading && <LoadingCat />} */}
      {post ? (
        <MissingPostEditForm
          initialData={post as IMissing}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <LoadingCat />
      )}
    </>
  );
};

export default MissingPostEdit;
