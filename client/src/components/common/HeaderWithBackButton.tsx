import "../../styles/scss/components/common/headerWithBackButton.scss";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface IProps {
  path?: string;
}

const HeaderWithBackButton = ({ path }: IProps) => {
  const navigate = useNavigate();
  return (
    <header className="back-header">
      <button
        onClick={() => {
          path ? navigate(path, { replace: true }) : navigate(-1);
        }}
        className="back-button"
      >
        <IoIosArrowBack />
      </button>
    </header>
  );
};

export default HeaderWithBackButton;
