import { /*IMenuList,*/ IMissing } from "../../models/missing.model";
// import PostAbstract from "./missingPost/PostAbstract";
import PostInfo from "./missingPost/PostInfo";
import "./../../styles/scss/components/missing/missingPostDetail.scss";
// import { useLocation, useNavigate } from "react-router-dom";
import PostExplanation from "./missingPost/PostExplaination";
import MapBox from "../common/MapBox";
import PostHead from "./missingPost/PostHead";
import ImageCarousel from "../common/ImageCarousel";
import PostSummary from "./common/PostSummary";

interface IProps {
  post: IMissing;
  showMenu?: () => void;
}

const MissingPostDetail = ({ post, showMenu }: IProps) => {
  return (
    <section className="missing-detail-box">
      <div className="category">
        <span>실종 고양이 수색</span>
      </div>
      <PostHead data={post} navigateUser={true} showMenu={showMenu} />
      <ImageCarousel images={post.images} />
      <PostSummary data={post} />
      <MapBox locations={post.locations} />
      <PostExplanation detail={post.detail} />
      <PostInfo reports={10} views={post.views} />
    </section>
  );
  // 좋아요 리포트 수 (-)
};

export default MissingPostDetail;
