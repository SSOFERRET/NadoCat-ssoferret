import { useNavigate, useParams } from "react-router-dom";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import LoadingCat from "../../components/loading/LoadingCat";
import { IMissingReport } from "../../models/missing.model";
import {
  useReadMissingReport,
  useUpdateMissingReportPost,
} from "../../hooks/useMissingReport";
import MissingReportPostEditForm from "../../components/missing/MissingReportPostEditForm";

const MissingReportPostEdit = () => {
  const navigate = useNavigate();

  const postId = Number(useParams().id);
  const reportId = Number(useParams().reportId);
  const { mutate: editMissingReportPost } = useUpdateMissingReportPost();
  const { data } = useReadMissingReport(postId, reportId);

  const handleFormSubmit = async (formData: FormData) => {
    await editMissingReportPost({ formData, postId, reportId });
    navigate(`/boards/missings/${postId}`);
  };

  return (
    <>
      <HeaderWithBackButton />
      {data ? (
        <MissingReportPostEditForm
          initialData={data as IMissingReport}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <LoadingCat />
      )}
    </>
  );
};

export default MissingReportPostEdit;
