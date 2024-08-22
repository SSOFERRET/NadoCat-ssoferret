import "../../styles/scss/components/common/avartar.scss";
import DefaultProfile from "../../assets/img/profileCat.png";

interface IProps {
  profileImage: string | null;
  nickname: string;
}

const Avartar = ({ profileImage, nickname }: IProps) => {
  return (
    <div className="avatar">
      <img src={profileImage ?? DefaultProfile} alt={nickname} />
    </div>
  );
};

export default Avartar;
