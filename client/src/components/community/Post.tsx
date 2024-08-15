import "../../styles/css/components/community/post.css";
import { ICommunity } from "../../models/community.model";
import { formatAgo, formatViews } from "../../utils/format/format";
import { useLocation, useNavigate } from "react-router-dom";
interface Props {
  post: ICommunity;
}

const Post = ({ post }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <li
      className="board-post"
      onClick={() => navigate(`${location.pathname}/${post.postId}`)}
    >
      <div className="post-info">
        <span className="post-title">{post.title}</span>
        <span className="post-content">{post.content}</span>
        <div className="post-meta">
          <span>{formatAgo(post.createdAt)}</span>
          <span>&middot;</span>
          <span>조회 {formatViews(post.views)}</span>
        </div>
      </div>
      <div className="post-image">
        {post.images.length && (
          <img src={post.images[0].url} alt={post.title} />
        )}
      </div>
    </li>
  );
};

export default Post;
