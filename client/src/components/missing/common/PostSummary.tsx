import { MdDateRange } from "react-icons/md";
import "./../../../styles/scss/components/missing/postSummary.scss";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IMissingComponentProps, isMissing } from "../missingPost/PostHead";
import { formatDate } from "../../../utils/format/format";

const PostSummary = ({ data }: IMissingComponentProps) => {
  return (
    <section className="post-summary">
      {isMissing(data) && (
        <>
          <div className="summary-column">
            <MdDateRange />
            <p className="column-key">실종 일시</p>
            <p className="data">{formatDate(data.time, true)}</p>
          </div>
          <div className="summary-column">
            <AiOutlineExclamationCircle />
            <p className="column-key">특징 요약</p>
            <p className="data">{data.missingCats.detail}</p>
          </div>
          <div className="summary-column">
            <HiOutlineLocationMarker />
            <p className="column-key">실종 위치</p>
            <p className="data">{data.locations.detail}</p>
          </div>
        </>
      )}
      {!isMissing(data) && (
        <>
          <div className="summary-column">
            <MdDateRange />
            <p className="column-key">발견 일시</p>
            <p className="data">{formatDate(data.time, true)}</p>
          </div>
          <div className="summary-column">
            <HiOutlineLocationMarker />
            <p className="column-key">발견 위치</p>
            <p className="data">{data.locations.detail}</p>
          </div>
          <div className="summary-column">
            <AiOutlineExclamationCircle />
            <p className="column-key">발견 시 상태</p>
            <p className="data">{data.detail}</p>
          </div>
        </>
      )}
    </section>
  );
};

export default PostSummary;
