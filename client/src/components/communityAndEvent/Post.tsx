import { useEffect, useRef, useState } from "react";
import "../../styles/scss/components/communityAndEvent/post.scss";
import { ICommunity } from "../../models/community.model";
import { formatAgo, formatViews } from "../../utils/format/format";
import { useLocation, useNavigate } from "react-router-dom";
import Tags from "../common/Tags";
import { IEvent } from "../../models/event.model";

// NOTE 타입 이거 맞나..
type PostType = ICommunity | IEvent;
interface IProps {
  post: PostType;
}

// 이게 맞나...
const calculateLine = (element: HTMLElement | null) => {
  if (element) {
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
    const height = element.clientHeight;
    const lines = Math.round(height / lineHeight);
    return lines === 1;
  }
  return false;
};

const isClosed = (post: PostType): post is IEvent => "isClosed" in post;

const Post = ({ post }: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [isSingleLine, setIsSingleLine] = useState<boolean>(true);

  useEffect(() => {
    if (titleRef.current) {
      setIsSingleLine(calculateLine(titleRef.current));
    }
  }, [post.title]);

  return (
    <li className="board-post" onClick={() => navigate(`${location.pathname}/${post.postId}`)}>
      <div className="board-post-info">
        <div className="post-title-container">
          <span className="post-title" ref={titleRef}>
            {post.title}
          </span>

          {isClosed(post) && (
            <span className={`is-closed ${post.isClosed ? "close" : "open"}`}>{post.isClosed ? "마감" : "모집중"}</span>
          )}
        </div>

        {isSingleLine && <span className="post-content">{post.content}</span>}

        <div className="post-meta">
          <span>{formatAgo(post.createdAt)}</span>
          <span>&middot;</span>
          <span className="post-views">조회 {formatViews(post.views)}</span>
          <Tags tags={post.tags.slice(0, 2)} size="sm" />
        </div>
      </div>
      <div className="post-image">{post.thumbnail && <img src={post.thumbnail} alt={post.title} />}</div>
    </li>
  );
};

export default Post;
