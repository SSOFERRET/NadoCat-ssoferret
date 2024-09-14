// import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import styles from "./search.module.scss";
import { SearchKeyword } from "../../utils/localStorage/localStorage";

interface IProps {
  recentKeywords: SearchKeyword[];
  deleteAll: () => void;
  deleteRecentKeyword: (id: number) => void;
  selectKeyword: (selectedKeyword: string) => void;
}

const RecentKeywords = ({
  recentKeywords,
  deleteAll,
  deleteRecentKeyword,
  selectKeyword,
}: IProps) => {
  return (
    <section className={styles.recentKeywordContainer}>
      <div className={styles.topMenu}>
        <span className={styles.title}>최근 검색어</span>
        <button onClick={deleteAll}>전체 삭제</button>
      </div>
      <ul className={styles.keywords}>
        {recentKeywords.map((item) => (
          <li key={item.id} className={styles.keyword}>
            <AiOutlineClockCircle className={styles.crossIcon} />
            <div className={styles.wrapper}>
              <span onClick={() => selectKeyword(item.keyword)}>
                {item.keyword}
              </span>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteRecentKeyword(item.id)}
              >
                <RxCross1 className={styles.clockIcon} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentKeywords;
