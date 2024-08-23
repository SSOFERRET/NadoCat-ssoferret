import React, { useState } from "react";
import "../../../styles/scss/components/user/my/myTab.scss";
import MyPage from "../../../pages/mypage/MyPage";

const MyTab = () => {
  const [activeTab, setActiveTab] = useState("tab-likepost");

  return (
    <div className="tab-container">
      <div className="tab-header">
        <button onClick={() => setActiveTab("tab-likepost")} className={activeTab === "tab-likepost"? "active-btn" : ""}>관심글</button>
        <button onClick={() => setActiveTab("tab-mypost")} className={activeTab === "tab-mypost"? "active-btn" : ""}>작성한글</button>
      </div>

      <div className="tab-content">
        {activeTab === "tab-likepost" && <MyPage />}
        {activeTab === "tab-mypost" && <div>작성한글 내용입니다.</div>}
      </div>
    </div>
  );
};

export default MyTab;
