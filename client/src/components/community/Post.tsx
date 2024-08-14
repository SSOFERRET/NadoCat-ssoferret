import "../../styles/scss/components/community/post.scss";
import { ICommunity } from "../../models/community.model";
import { formatAgo, formatViews } from "../../utils/format/format";
interface Props {
  post: ICommunity;
}

const Post = ({ post }: Props) => {
  return (
    <li className="board-post">
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
