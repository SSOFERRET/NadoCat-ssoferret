import React from "react";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { useReadStreetCatPost, useUpdateStreetCatPost } from "../../hooks/useStreetCat";
import EditForm from "../../components/streetCat/EditForm";
import { useParams } from "react-router-dom";
import LoadingCat from "../../components/loading/LoadingCat";

const StreetCatEdit: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);  
  const {data} = useReadStreetCatPost(postId);
  const { mutate: editPost, isLoading, error } = useUpdateStreetCatPost();

  const handleFormSubmit = (formData: FormData) => {
    editPost({formData, postId});
  };

  return (
    <>
      <HeaderWithBackButton />
      {isLoading && <LoadingCat />}
      {data ? <EditForm initialData={data} onSubmit={handleFormSubmit} /> : <LoadingCat />}
    </>
  );
};

export default StreetCatEdit;
