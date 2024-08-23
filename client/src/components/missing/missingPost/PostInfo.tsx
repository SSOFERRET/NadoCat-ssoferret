import { formatViews } from "../../../utils/format/format";
import "./../../../styles/scss/components/missing/postInfo.scss";
import { GoHeartFill } from "react-icons/go";
import { TbViewfinder } from "react-icons/tb";
import { GrView } from "react-icons/gr";
import { useState } from "react";

interface IProps {
  likes: number;
  reports: number;
  views: number;
}

type TLiked = "liked-true" | "liked-false";

const PostInfo = ({ likes, reports, views }: IProps) => {
  const [liked, setLiked] = useState<boolean>(false);

  const handleLiked = () => {
    setLiked(!liked);
  };
  return (
    <section className="post-info">
      <div className={liked ? "liked-true" : ("liked-false" as TLiked)}>
        <GoHeartFill onClick={handleLiked} />
        <span>{likes}</span>
      </div>
      <div className="reports">
        <TbViewfinder />
        <span>{reports}</span>
      </div>
      <div className="views">
        <GrView />
        <span>{formatViews(views)}</span>
      </div>
    </section>
  );
};

export default PostInfo;
