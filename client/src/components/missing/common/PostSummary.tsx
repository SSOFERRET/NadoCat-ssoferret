import { MdDateRange } from "react-icons/md";
import "./../../../styles/scss/components/missing/postSummary.scss";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface IProps {
  time: string;
  catDetail: string;
  location: string;
}
const PostSummary = ({ time, catDetail, location }: IProps) => {
  return (
    <section className="post-summary">
      <div className="summary-column">
        <MdDateRange />
        <p className="column-key">실종 일시</p>
        <p className="data">{time}</p>
      </div>
      <div className="summary-column">
        <AiOutlineExclamationCircle />
        <p className="column-key">특징 요약</p>
        <p className="data">{catDetail}</p>
      </div>
      <div className="summary-column">
        <HiOutlineLocationMarker />
        <p className="column-key">실종 위치</p>
        <p className="data">{location}</p>
      </div>
    </section>
  );
};

export default PostSummary;
