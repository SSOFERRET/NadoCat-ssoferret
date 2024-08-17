import "../../styles/css/components/communityAndEvent/postDetail.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { formatDate, formatViews } from "../../utils/format/format";
import Avartar from "../common/Avartar";
import { AiFillHeart } from "react-icons/ai";
import { PiChatCircleBold } from "react-icons/pi";
// import { MdDateRange } from "react-icons/md";
import Tags from "../common/Tags";
import { ICommunity } from "../../models/community.model";
import ImageCarousel from "../common/ImageCarousel";
import { IEvent } from "../../models/event.model";

// CHECKLIST
// [ ] 조회수 기능 구현

type PostType = ICommunity | IEvent;
interface IProps {
  post: PostType;
  commentCount: number;
}

const isClosed = (post: PostType): post is IEvent => "isClosed" in post;

// const isDate = (post: PostType): post is IEvent => "date" in post;

const PostDetail = ({ post, commentCount }: IProps) => {
  return (
    <section className="post-details">
      {post?.users && (
        <div className="user">
          <Avartar
            profileImage={post.users.profileImage}
            nickname={post.users.nickname}
          />
          <div className="user-info">
            <div className="user-details">
              <span className="nickname">{post.users.nickname}</span>
              <span className="date">{formatDate(post.createdAt)}</span>
            </div>
            <div className="post-status">
              {isClosed(post) && (
                <span
                  className={`is-closed ${post.isClosed ? "close" : "open"}`}
                >
                  {post.isClosed ? "마감" : "모집중"}
                </span>
              )}
              <HiOutlineDotsVertical className="options-icon" />
            </div>
          </div>
        </div>
      )}
      <span className="post-title">{post.title}</span>
      {post.images.length && <ImageCarousel images={post.images} />}

      {/* {isDate(post) && (
        <div className="post-event-date">
          <div>
            <MdDateRange />
            <span>날짜</span>
          </div>
          <span>{formatDate(post.date)}</span>
        </div>
      )} */}

      <Tags tags={post.tags} />
      <div className="post-info">
        <div className="likes">
          <AiFillHeart />
          <span>{post.likes}</span>
        </div>
        <div className="comment-count">
          <PiChatCircleBold />
          <span>{commentCount}</span>
        </div>
        <div className="views">
          조회수 <span>{formatViews(post.views)}</span>
        </div>
      </div>
      <pre className="post-content">{post.content}</pre>
    </section>
  );
};

export default PostDetail;
