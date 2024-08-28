// import { IImage } from "../../../models/image.model";
// import ImageCarousel from "../../common/ImageCarousel";
import PostHead from "./PostHead";
import "./../../../styles/scss/components/missing/postAbstract.scss";
import PostSummary from "../common/PostSummary";
import { /*IMenuList, */ IMissing } from "../../../models/missing.model";
// import { formatDate } from "../../../utils/format/format";
import { useLocation, useNavigate } from "react-router-dom";
import PostInfo from "./PostInfo";

interface IProps {
  post: IMissing;
  navigateUser?: boolean;
  showMenu?: () => void;
}

const PostAbstract = ({ post, navigateUser, showMenu }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateToPostDetail = () =>
    navigate(`${location.pathname}/${post.postId}`);

  return (
    <section className="post-abstract">
      <div className="poster">
        <PostHead data={post} navigateUser={navigateUser} showMenu={showMenu} />

        <div className="navigate-detail" onClick={navigateToPostDetail}>
          <div className="thumbnail">
            <img src={post.images[0].url} alt="missing-cat-thumbnail" />
          </div>
          <PostSummary data={post} />
          <PostInfo reports={10} views={post.views} />
        </div>
      </div>
    </section>
  );
};

export default PostAbstract;
