import "../../styles/scss/components/common/newPostButton.scss";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface IProps {
  path: string;
}

const NewPostButton = ({ path }: IProps) => {
  const navigate = useNavigate();

  return (
    <button className="new-post-button" onClick={() => navigate(path)}>
      <FaPlus />
      글쓰기
    </button>
  );
};

export default NewPostButton;
