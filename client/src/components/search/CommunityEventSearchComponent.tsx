import { useEffect, useRef, useState } from "react";
import Tags from "../common/Tags";
import { ICommunity } from "../../models/community.model";
import { formatAgo, formatViews } from "../../utils/format/format";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./communityEventSearchComponent.module.scss";
import { IEvent } from "../../models/event.model";

type PostType = ICommunity | IEvent;
interface IProps<T> {
  post: T;
}

const calculateLine = (element: HTMLElement | null) => {
  if (element) {
    const lineHeight = parseInt(
      window.getComputedStyle(element).lineHeight,
      10
    );
    const height = element.clientHeight;
    const lines = Math.round(height / lineHeight);
    return lines === 1;
  }
  return false;
};

const isClosed = (post: PostType): post is IEvent => "isClosed" in post;

const CommunityEventSearchComponent = <T extends PostType>({
  post,
}: IProps<T>) => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [isSingleLine, setIsSingleLine] = useState<boolean>(true);
  console.log(post);

  useEffect(() => {
    if (titleRef.current) {
      setIsSingleLine(calculateLine(titleRef.current));
    }
  }, [post.title, post.thumbnail]);

  return (
    <div
      className={styles.post}
      onClick={() =>
        navigate(
          `/boards/${
            Object.keys(post).includes("isClosed") ? "events" : "communities"
          }/${post.postId}`
        )
      }
    >
      <div className={styles.postInfo}>
        <div className={styles.container}>
          <span className={styles.title} ref={titleRef}>
            {post.title}
          </span>

          {isClosed(post) && (
            <span
              className={`${styles.isClosed} ${
                post.isClosed ? styles.close : styles.open
              }`}
            >
              {post.isClosed ? "마감" : "모집중"}
            </span>
          )}
        </div>

        {isSingleLine && <span className={styles.content}>{post.content}</span>}

        <div className={styles.meta}>
          <span>{formatAgo(post.createdAt)}</span>
          <span>&middot;</span>
          <span className={styles.views}>조회 {formatViews(post.views)}</span>
          <Tags tags={post.tags.slice(0, 2)} size="sm" />
        </div>
      </div>
      <div className={styles.image}>
        {post.thumbnail && <img src={post.thumbnail} alt={post.title} />}
      </div>
    </div>
  );
};

export default CommunityEventSearchComponent;
