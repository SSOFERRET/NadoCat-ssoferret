import "../../styles/scss/components/common/avartar.scss";
import DefaultProfile from "../../assets/img/profileImg1.png";

interface IProps {
  profileImage: string | null;
  nickname: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const Avartar = ({ profileImage, nickname, onClick, size = "sm" }: IProps) => {
  return (
    <div className={`avatar ${size}`} onClick={onClick}>
      <img src={profileImage ?? DefaultProfile} alt={nickname} />
    </div>
  );
};

export default Avartar;
