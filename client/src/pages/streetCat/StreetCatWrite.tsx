import React from "react";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import WriteForm from "../../components/streetCat/WriteForm";
import { useAddStreetCatPost } from "../../hooks/useStreetCat";

const StreetCatWrite: React.FC = () => {
  const { mutate: submitPost, isLoading, error } = useAddStreetCatPost();

  const handleFormSubmit = (formData: FormData) => {
    submitPost(formData);
  };

  return (
    <>
      <HeaderWithBackButton />
      <WriteForm onSubmit={handleFormSubmit}/>
    </>
  );
};

export default StreetCatWrite;
