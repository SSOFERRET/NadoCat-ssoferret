import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import MissingWriteForm from "../../components/missing/MissingWriteForm";
import { addMissingPost } from "../../hooks/useMissing";

export interface ICatInfo {
  catName: string;
  birth?: string;
  gender?: string;
  detail: string;
}

const MissingPostWrite: React.FC = () => {
  const { mutate: submitPost } = addMissingPost();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: FormData) => {
    await submitPost(formData);
    navigate("/boards/missings");
  };

  return (
    <>
      <HeaderWithBackButton />
      <MissingWriteForm onSubmit={handleFormSubmit} />
    </>
  );
};

export default MissingPostWrite;
