import "./../../../styles/scss/components/missing/postButton.scss";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface IProps {
  path: string;
  text?: string;
}

const PostButton = ({ path, text }: IProps) => {
  const navigate = useNavigate();

  return (
    <button className="missing-post-button" onClick={() => navigate(path)}>
      {!text && <FaPlus />}
      {text ?? "글쓰기"}
    </button>
  );
};

export default PostButton;