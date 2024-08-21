import React, { useState } from "react";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCat.scss";
import WriteButton from "../../components/common/WriteButton";
import TabNavigation from "../../components/streetCat/TabNavigation";
import StreetCatPosts from "../../components/streetCat/StreetCatPosts";
import MyStreetCatPosts from "../../components/streetCat/MyStreetCatPosts";
import StreetCatsMap from "../../components/streetCat/StreetCatsMap";

// CHECKLIST
// [ ] 페이지별 라우터 추가 필요?
// [x] 페이지별 필요 컴포넌트 불러오기 (동네고양이도감, 내도감, 동네고양이지도)

const StreetCats: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const renderContent = () => {
    switch (selectedTab) {
      case 1:
        return <StreetCatPosts />;
      case 2:
        return <MyStreetCatPosts />;
      case 3:
        return <StreetCatsMap />;
      default:
        return null;
    }
  };

  return (
    <>
      <section className="street-cat-section">
        <TabNavigation selectedTab={selectedTab} onSelectTab={setSelectedTab} />
        {renderContent()}
        {/* <WriteButton /> */}
      </section>
    </>
  );
};

export default StreetCats;
