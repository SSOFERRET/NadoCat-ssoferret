import { IMissing } from "../../models/missing.model";
import PostAbstract from "./common/PostAbstract";
import PostInfo from "./common/PostInfo";
import "./../../styles/scss/components/missing/missingPost.scss";

interface IProps {
  post: IMissing;
}

const MissingPost = ({ post }: IProps) => {
  return (
    <section className="post-box">
      <PostAbstract post={post} />
      <PostInfo likes={10} reports={10} views={1000} />
    </section>
  );
};

export default MissingPost;
