import { /*React,*/ useState } from "react";
import "../../../styles/scss/components/user/my/myTab.scss";
import Posts from "../../mypage/Posts";
import Friends from "../../../pages/user/Friends";
import useFriends from "../../../hooks/useFriends";
import MyPosts from "./MyPosts";

const MyTab = () => {
  const [activeTab, setActiveTab] = useState("tab-likepost");
  const { setEnabled } = useFriends(); // ⬅️ 여기 추가

  // NOTE 친구 목록 추가 했습니다. 하면서 CSS도 수정 했습니다.
  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("tab-likepost")}
            className={activeTab === "tab-likepost" ? "active-btn" : ""}
          >
            관심글
          </button>
          <button
            onClick={() => setActiveTab("tab-mypost")}
            className={activeTab === "tab-mypost" ? "active-btn" : ""}
          >
            작성한글
          </button>
          <button
            onClick={() => {
              setActiveTab("tab-myfriends");
              setEnabled(true);
            }}
            className={activeTab === "tab-myfriends" ? "active-btn" : ""}
          >
            친구 목록
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "tab-likepost" && <div className="interest-posts"><Posts /></div>}
        {activeTab === "tab-mypost" && <MyPosts />}
        {activeTab === "tab-myfriends" && <Friends />}
      </div>
    </div>
  );
};

export default MyTab;
