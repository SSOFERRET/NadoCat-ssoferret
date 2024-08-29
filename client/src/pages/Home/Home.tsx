import "../../styles/scss/pages/home/home.scss";
import HomeStreetCats from "../../components/home/HomeStreetCats";
import HomeMissings from "../../components/home/HomeMissings";
import HomeCommunitiesAndEvents from "../../components/home/HomeCommunitiesAndEvents";
import TopBenner from "../../components/home/TopBenner";
import MiddleBanner from "../../components/home/MiddleBanner";

const Home = () => {
  return (
    <div className="home-container">
      <TopBenner />

      <HomeStreetCats />

      <MiddleBanner />

      <HomeMissings />

      <HomeCommunitiesAndEvents />
    </div>
  );
};

export default Home;
