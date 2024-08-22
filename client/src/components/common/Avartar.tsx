import React from "react";
import "../../styles/scss/components/common/avartar.scss";

interface IProps {
  profileImage: string | null;
  nickname: string;
}

const Avartar = ({ profileImage, nickname }: IProps) => {
  return <div className="avatar">{profileImage && <img src={profileImage} alt={nickname} />}</div>;
};

export default Avartar;
