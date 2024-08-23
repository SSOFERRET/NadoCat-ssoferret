import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { SearchKeyword } from "../../utils/localStorage/localStorage";

interface IProps {
  recentKeywords: SearchKeyword[];
  deleteAll: () => void;
  deleteRecentKeyword: (id: number) => void;
}

const RecentKeywords = ({ recentKeywords, deleteAll, deleteRecentKeyword }: IProps) => {
  return (
    <section className="recent-keyword-container">
      <div className="recent-keyword-top-menu">
        <span className="recent-keyword-title">최근 검색어</span>
        <button onClick={deleteAll}>전체 삭제</button>
      </div>
      <ul className="recent-keywords">
        {recentKeywords.map((item) => (
          <li key={item.id} className="recent-keyword">
            <AiOutlineClockCircle className="clock-icon" />
            <div className="recent-keyword-wrapper">
              <span>{item.keyword}</span>
              <button className="recent-keyword-delete-btn" onClick={() => deleteRecentKeyword(item.id)}>
                <RxCross1 className="cross-icon" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentKeywords;
