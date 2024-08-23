import { IMissing } from "../../models/missing.model";
import PostAbstract from "./missingPost/PostAbstract";
import PostInfo from "./missingPost/PostInfo";
import "./../../styles/scss/components/missing/missingPost.scss";
import { useLocation, useNavigate } from "react-router-dom";

interface IProps {
  post: IMissing;
}

const MissingPost = ({ post }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToPostDetail = () =>
    navigate(`${location.pathname}/${post.postId}`);

  return (
    <section className="post-box" onClick={navigateToPostDetail}>
      <PostAbstract post={post} />
      <PostInfo likes={10} reports={10} views={post.views} />
    </section>
  );
  // 좋아요 리포트 수 (-)
};

export default MissingPost;
