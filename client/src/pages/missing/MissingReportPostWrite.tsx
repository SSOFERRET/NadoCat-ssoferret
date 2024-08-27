import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { useNavigate, useParams } from "react-router-dom";
import MissingReportWriteForm from "../../components/missing/MissingReportWriteForm";
import { useAddMissingReportPost } from "../../hooks/useMissingReport";

export interface ICatInfo {
  catName: string;
  birth?: string;
  gender?: string;
  detail: string;
}

const MissingReportPostWrite: React.FC = () => {
  const { mutate: submitPost } = useAddMissingReportPost();
  const navigate = useNavigate();
  const postId = Number(useParams().id);

  const handleFormSubmit = async (formData: FormData) => {
    await submitPost({ formData, postId });
    navigate(`/boards/missings/${postId}`);
  };

  return (
    <>
      <HeaderWithBackButton />
      <MissingReportWriteForm onSubmit={handleFormSubmit} />
    </>
  );
};

export default MissingReportPostWrite;
