import "../../styles/scss/pages/home/home.scss";
import EmblaCarousel from "../../components/common/embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import MiddleBenner from "../../components/home/MiddleBenner";
import HomeStreetCats from "../../components/home/HomeStreetCats";
import HomeMissings from "../../components/home/HomeMissings";
import HomeCommunitiesAndEvents from "../../components/home/HomeCommunitiesAndEvents";

const bannersData = [
  {
    imageId: 1,
    url: "https://picsum.photos/id/111/1200/400",
  },
  {
    imageId: 2,
    url: "https://picsum.photos/id/222/1200/400",
  },
  {
    imageId: 3,
    url: "https://picsum.photos/id/121/1200/400",
  },
  {
    imageId: 4,
    url: "https://picsum.photos/id/23/1200/400",
  },
];

const OPTIONS: EmblaOptionsType = {
  containScroll: "trimSnaps",
  align: "start",
  // slidesToScroll: 1,
  dragFree: true,
  loop: false,
};

// CHECKLIST
// [ ] 최상단 베너 만들기
// [x] 중간 베너 만들기
// [x] 게시글용 캐러셀 슬라이드 만들기
// [x] 우리 동네 고양이
// [ ] 실종 고양이
// [x] 커뮤니티, 이벤트 필터링
// [x] 커뮤니티
// [x] 이벤트 모임

const Home = () => {
  return (
    <div className="home-container">
      <section className="home-main-images"></section>

      <HomeStreetCats />

      <MiddleBenner />

      <HomeMissings />

      <HomeCommunitiesAndEvents />
    </div>
  );
};

export default Home;
