import "../../styles/scss/components/common/newPostButton.scss";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface IProps {
  path: string;
  text?: string;
}

const NewPostButton = ({ path, text }: IProps) => {
  const navigate = useNavigate();

  return (
    <button className="new-post-button" onClick={() => navigate(path)}>
      <FaPlus />
      {text ?? "글쓰기"}
    </button>
  );
};

export default NewPostButton;
