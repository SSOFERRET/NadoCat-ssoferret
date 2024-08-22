import React from "react";
import "../../styles/scss/components/common/avartar.scss";

interface IProps {
  profileImage: string | null;
  nickname: string;
}

const DEFAULT_PROFILE: string = "/src/assets/img/profileImg1.png";

const Avartar = ({ profileImage, nickname }: IProps) => {

  return (
    <div className="avatar">
      {/* {profileImage && <img src={profileImage} alt={nickname} />} */}
      {!profileImage && (
        <img src={DEFAULT_PROFILE} alt={nickname} className="default_profile" />
      )}
    </div>
  );
};

export default Avartar;
