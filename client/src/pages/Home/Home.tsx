import "../../styles/scss/pages/home/home.scss";
import MiddleBenner from "../../components/home/MiddleBenner";
import HomeStreetCats from "../../components/home/HomeStreetCats";
import HomeMissings from "../../components/home/HomeMissings";
import HomeCommunitiesAndEvents from "../../components/home/HomeCommunitiesAndEvents";
import TopBenner from "../../components/home/TopBenner";

// CHECKLIST
// [x] 최상단 베너 만들기
// [x] 중간 베너 만들기
// [x] 게시글용 캐러셀 슬라이드 만들기
// [x] 우리 동네 고양이
// [x] 실종 고양이
// [x] 커뮤니티, 이벤트 필터링
// [x] 커뮤니티
// [x] 이벤트 모임

const Home = () => {
  return (
    <div className="home-container">
      <TopBenner />

      <HomeStreetCats />

      <MiddleBenner />

      <HomeMissings />

      <HomeCommunitiesAndEvents />
    </div>
  );
};

export default Home;
