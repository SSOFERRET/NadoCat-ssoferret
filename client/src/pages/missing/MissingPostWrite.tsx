import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import useMissings from "../../hooks/useMissings";
import { useState } from "react";
import { ILocation } from "../../models/location.model";
import MissingWriteForm from "../../components/missing/MissingWriteForm";
import { useAddStreetCatPost } from "../../hooks/useStreetCat";
import useMissing, { addMissingPost } from "../../hooks/useMissing";

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
