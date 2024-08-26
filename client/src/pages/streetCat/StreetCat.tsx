import React, { useEffect, useState } from "react";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCat.scss";
import WriteButton from "../../components/common/WriteButton";
import TabNavigation from "../../components/streetCat/TabNavigation";
import StreetCatPosts from "../../components/streetCat/StreetCatPosts";
import MyStreetCatPosts from "../../components/streetCat/MyStreetCatPosts";
import StreetCatsMap from "../../components/streetCat/StreetCatsMap";
import { useLocation, useNavigate } from "react-router-dom";

const StreetCats: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromQuery = query.get('tab');
  const [selectedTab, setSelectedTab] = useState<number>(Number(tabFromQuery) || 1);

  useEffect(() => {
    if (tabFromQuery) {
      setSelectedTab(Number(tabFromQuery));
    }
  }, [tabFromQuery]);

  const handleTabSelect = (id: number) => {
    setSelectedTab(id);
    navigate({
      pathname: location.pathname,
      search: `?tab=${id}`,
    });
  };

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
        <TabNavigation selectedTab={selectedTab} onSelectTab={handleTabSelect} />
        {renderContent()}
      </section>
      {tabFromQuery === "1" || tabFromQuery === null ? <WriteButton /> : ""}
    </>
  );
};

export default StreetCats;
