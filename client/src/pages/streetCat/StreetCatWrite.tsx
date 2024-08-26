import React from "react";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import WriteForm from "../../components/streetCat/WriteForm";
import { useAddStreetCatPost } from "../../hooks/useStreetCat";
import { useNavigate } from "react-router-dom";

const StreetCatWrite: React.FC = () => {
  const { mutate: submitPost, isLoading, error } = useAddStreetCatPost();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: FormData) => {
    await submitPost(formData);
    navigate("/boards/street-cats")
  };

  return (
    <>
      <HeaderWithBackButton />
      <WriteForm onSubmit={handleFormSubmit}/>
    </>
  );
};

export default StreetCatWrite;
