import React, { useState } from "react";
import "../../styles/css/components/streetCat/tabNavigation.css";

interface Tab {   
  id: number;
  label: string;
}

const tabs: Tab[] = [
  { id: 1, label: '동네 고양이 도감' },
  { id: 2, label: '내 도감' },
  { id: 3, label: '동네 고양이 지도' },
];

const TabNavigation: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].id);

  const handleTabClick = (id: number) => {
    setSelectedTab(id);
    console.log(selectedTab);
  };

  return (
    <>
      <nav className="street-cat-nav">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} 
                className={tab.id === selectedTab ? "active" : ""} 
                onClick={() => handleTabClick(tab.id)}>
              <span>{tab.label}</span>
              {tab.id === selectedTab ? <span className="nav-bar"></span> : ""}
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default TabNavigation;