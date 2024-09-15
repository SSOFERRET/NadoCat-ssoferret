import "../../styles/scss/components/common/avatar.scss";
import DefaultProfile from "../../assets/img/profileImg1.png";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

interface IProps {
  profileImage: string | null;
  nickname: string;
  onClick?: () => void;
  size?: "mn" | "sm" | "md" | "lg";
}

const Avatar = ({ profileImage, nickname, onClick, size = "sm" }: IProps) => {
  const imageRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      if (target instanceof HTMLImageElement) {
        const dataSrc = target.dataset.src;
        if (dataSrc) {
          target.src = dataSrc;
        }
      }
    }
  });

  return (
    <div
      className={`avatar ${size} ${onClick ? "pointer" : ""}`}
      onClick={onClick}
    >
      <img
        ref={imageRef}
        data-src={profileImage || DefaultProfile}
        alt={nickname}
      />
    </div>
  );
};

export default Avatar;
