import "../../styles/scss/components/communityAndEvent/postDetail.scss";
import { formatViews } from "../../utils/format/format";
import { AiFillHeart } from "react-icons/ai";
import { PiChatCircleBold } from "react-icons/pi";
// import { MdDateRange } from "react-icons/md";
import Tags from "../common/Tags";
import { ICommunityDetail } from "../../models/community.model";
import { IEventDetail } from "../../models/event.model";
import ImageCarousel from "../common/ImageCarousel";
import ActionBar from "../common/ActionBar";

// CHECKLIST
// [ ] 조회수 기능 구현

type PostType = ICommunityDetail | IEventDetail;
interface IProps {
  post: PostType;
  commentCount: number;
  showMenu: () => void;
  toggleLike: () => void;
}

const PostDetail = ({ post, commentCount, showMenu, toggleLike }: IProps) => {
  return (
    <section className="post-details">
      <ActionBar
        liked={post.liked}
        userInfo={post.users}
        createdAt={post.createdAt}
        showMenu={showMenu}
        toggleLike={toggleLike}
      />
      <span className="post-title">{post.title}</span>
      {post.images.length && <ImageCarousel images={post.images} />}

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
