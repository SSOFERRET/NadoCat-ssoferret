import { useState } from "react";
import HomeCommunity from "./HomeCommunity";
import HomeEvent from "./HomeEvent";
import Cat from "../../assets/img/Maskgroup.png";
import { useIntersectionObserver } from "../streetCat/IntersectionObserver";

type Menu = {
  id: number;
  category: Category;
  name: string;
};

export type Category = "community" | "event";

const menu: Menu[] = [
  { id: 1, category: "community", name: "커뮤니티" },
  { id: 2, category: "event", name: "이벤트 · 모임" },
];

const HomeCommunitiesAndEvents = () => {
  const [isShow, setIsShow] = useState(false);
  const [category, setCategory] = useState<Category>(menu[0].category);

  const postRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setIsShow(true);
    }
  });

  return (
    <section className="home-communities-events" ref={postRef}>
      <div className="header">
        <div className="main-title">
          <span>혹시</span>
          <span>나만 없어 고양이?</span>
        </div>
        <div className="title">
          <span>여기서 해결해요!</span>
        </div>
        <img src={Cat} alt="cat" />
      </div>

      <div className="tabs">
        <ul className="tab">
          {menu.map((item) => (
            <li
              className={`${category === item.category ? "active" : ""}`}
              key={item.id}
              onClick={() => setCategory(item.category)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {isShow && (
        <>
          {category === "community" && <HomeCommunity category={category} />}

          {category === "event" && <HomeEvent category={category} />}
        </>
      )}
    </section>
  );
};

export default HomeCommunitiesAndEvents;
