import { IImage } from "../../../models/image.model";
import ImageCarousel from "../../common/ImageCarousel";
import PostHead from "./PostHead";
import "./../../../styles/scss/components/missing/postAbstract.scss";
import PostSummary from "../common/PostSummary";
import { IMenuList, IMissing } from "../../../models/missing.model";
import { formatDate } from "../../../utils/format/format";
import { useLocation, useNavigate } from "react-router-dom";

interface IProps {
  post: IMissing;
  navigateUser?: boolean;
  showMenu?: () => void;
}

const images: IImage[] = [
  {
    url: "/src/assets/img/test.png",
    imageId: 1,
  },
  {
    url: "/src/assets/img/test2.png",
    imageId: 2,
  },
];

const PostAbstract = ({ post, navigateUser, showMenu }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateToPostDetail = () =>
    navigate(`${location.pathname}/${post.postId}`);

  return (
    <section className="post-abstract">
      <PostHead data={post} navigateUser={navigateUser} showMenu={showMenu} />
      <div className="navigate-detail" onClick={navigateToPostDetail}>
        <ImageCarousel images={images} />
        <PostSummary data={post} />
      </div>
    </section>
  );
};

export default PostAbstract;
