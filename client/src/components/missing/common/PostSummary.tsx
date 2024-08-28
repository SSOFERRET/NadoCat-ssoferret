import { MdDateRange } from "react-icons/md";
import "./../../../styles/scss/components/missing/postSummary.scss";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IMissingComponentProps, isMissing } from "../missingPost/PostHead";
import { formatDate } from "../../../utils/format/format";

export const formatGenderToString = (genderChar: string) =>
  genderChar === "M" ? "수컷" : genderChar === "F" ? "암컷" : "모름";

export const calculateAge = (dateString: string) => {
  const birthDate = new Date(dateString);

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
};

const PostSummary = ({ data }: IMissingComponentProps) => {
  return (
    <section className="post-summary">
      {isMissing(data) && (
        <>
          <div className="summary-column">
            <MdDateRange />
            <p className="column-key">이름</p>
            <p className="data">{data.missingCats.name}</p>
          </div>
          <div className="summary-column">
            <MdDateRange />
            <p className="column-key">성별</p>
            <p className="data">
              {formatGenderToString(data.missingCats.gender as string)}
            </p>
          </div>
          <div className="summary-column">
            <MdDateRange />
            <p className="column-key">나이</p>
            <p className="data">{calculateAge(data.missingCats.birth)}</p>
          </div>
          <div className="summary-column">
            <MdDateRange />
            <p className="column-key">특징</p>
            <p className="data">{data.missingCats.detail}</p>
          </div>
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
