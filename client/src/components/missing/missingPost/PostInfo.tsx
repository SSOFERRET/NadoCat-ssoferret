import { formatViews } from "../../../utils/format/format";
import "./../../../styles/scss/components/missing/postInfo.scss";
import { TbViewfinder } from "react-icons/tb";
import { GrView } from "react-icons/gr";

interface IProps {
  reports: number;
  views: number;
}

const PostInfo = ({ views }: IProps) => {
  return (
    <section className="post-info">
      {/* <div className="reports">
        <TbViewfinder />
        <span>{reports}</span>
      </div> */}
      <div className="views">
        <GrView />
        <span>{formatViews(views)}</span>
      </div>
    </section>
  );
};

export default PostInfo;
