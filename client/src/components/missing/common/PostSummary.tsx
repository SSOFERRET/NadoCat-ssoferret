import { MdDateRange, MdOutlineLabel } from "react-icons/md";
import "./../../../styles/scss/components/missing/postSummary.scss";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IMissingComponentProps } from "../missingPost/PostHead";
import { calculateAge, formatDate } from "../../../utils/format/format";
import { formatGenderToString } from "../../../utils/format/genderToString";
import { isMissing } from "../../../utils/type/isMissing";

const PostSummary = ({ data }: IMissingComponentProps) => {
  return (
    <section className="post-summary">
      {isMissing(data) && (
        <>
          <div className="summary-column">
            <MdOutlineLabel />
            <p className="column-key">이름</p>
            <p className="data">{data.missingCats.name}</p>
          </div>
          <div className="summary-column">
            <MdOutlineLabel />
            <p className="column-key">성별</p>
            <p className="data">{formatGenderToString(data.missingCats.gender as string)}</p>
          </div>
          <div className="summary-column">
            <MdOutlineLabel />
            <p className="column-key">나이</p>
            <p className="data">{calculateAge(data.missingCats.birth)}</p>
          </div>
          {/* <div className="summary-column">
            <MdDateRange />
            <p className="column-key">특징</p>
            <p className="data">{data.missingCats.detail}</p>
          </div> */}
          <div className="divider" />
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
        </>
      )}
    </section>
  );
};

export default PostSummary;
