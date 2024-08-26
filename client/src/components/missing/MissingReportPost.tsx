import { /*IMissing,*/ IMissingReport } from "../../models/missing.model";
import "./../../styles/scss/components/missing/missingReportPost.scss";
import PostHead from "./missingPost/PostHead";
import PostSummary from "./common/PostSummary";
import MapBox from "../common/MapBox";

interface IProps {
  post: IMissingReport;
}

const MissingReportPost = ({ post }: IProps) => {
  return (
    <section className={`report-post-box ${post.match}`}>
      <PostHead data={post} />
      <div className="image-map">
        <div className="image-container">
          <img src="/src/assets/img/heartCat.png" />
        </div>
        <div className="map-container">
          <MapBox locations={post.locations} />
        </div>
      </div>
      <PostSummary data={post} />
    </section>
  );
  // 좋아요 리포트 수 (-)
};

export default MissingReportPost;
