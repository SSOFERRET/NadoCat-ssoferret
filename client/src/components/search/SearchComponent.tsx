import { useEffect, useRef, useState } from "react";
import Tags from "../common/Tags";
import { formatAgo, formatDate } from "../../utils/format/format";
import { useNavigate } from "react-router-dom";
import styles from "./searchComponent.module.scss";
import { ISearchData } from "../../hooks/useSearch";
import Avatar from "../common/Avatar";

interface IProps {
  post: ISearchData;
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

const SearchComponent = ({ post }: IProps) => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [isSingleLine, setIsSingleLine] = useState<boolean>(true);

  const isEvent = (post: ISearchData): boolean =>
    Object.keys(post).includes("isClosed");
  const isMissing = (post: ISearchData): boolean =>
    Object.keys(post).includes("time");
  const isCommunity = (post: ISearchData): boolean =>
    Object.keys(post).includes("content") && !isEvent(post);
  const isStreetCat = (post: ISearchData): boolean =>
    Object.keys(post).includes("location") && !isMissing(post);

  const getNavigateUrl = (post: ISearchData): string => {
    if (isEvent(post)) return "events";
    if (isMissing(post)) return "missings";
    if (isCommunity(post)) return "communities";
    if (isStreetCat(post)) return "street-cats";
    throw new Error("search data type is wrong");
  };

  useEffect(() => {
    if (titleRef.current) {
      setIsSingleLine(calculateLine(titleRef.current));
    }
    isMissing(post) && console.log("고양이", post);
  }, [post]);

  return (
    <div
      className={styles.post}
      onClick={() =>
        navigate(`/boards/${getNavigateUrl(post)}/${post?.postId}`)
      }
    >
      <div className={styles.postInfo}>
        <div className={styles.userInfo}>
          <Avatar profileImage={post.profile} size="mn" />
          {isMissing(post) ? (
            <span className={styles.missings}>{post.title}</span>
          ) : (
            <span className={styles.notMissings}>{post.nickname}</span>
          )}
        </div>
        <div className={styles.container}>
          <span className={styles.title} ref={titleRef}>
            {post.title}
          </span>

          {isEvent(post) && (
            <span
              className={`${styles.isClosed} ${
                post.isClosed ? styles.close : styles.open
              }`}
            >
              {post.isClosed ? "마감" : "모집중"}
            </span>
          )}
        </div>

        {isSingleLine && !isMissing(post) && (
          <span className={styles.content}>{post.content}</span>
        )}
        {isMissing(post) && (
          <div className={styles.missingContent}>
            <span className={styles.content}>실종위치</span>
            <span className={styles.content}>{post.location}</span>
          </div>
        )}

        {isMissing(post) && (
          <div className={styles.missingContent}>
            <span className={styles.content}>실종날짜</span>
            <span className={styles.content}>
              {formatDate(post.time as string)}
            </span>
          </div>
        )}

        <div className={styles.meta}>
          <span>{formatAgo(post.createdAt)}</span>
          <span>&middot;</span>
          {post.tags && <Tags tags={post.tags.slice(0, 2)} size="sm" />}
        </div>
      </div>
      <div className={styles.image}>
        {post.thumbnail && <img src={post.thumbnail} alt={post.title} />}
      </div>
    </div>
  );
};

export default SearchComponent;
