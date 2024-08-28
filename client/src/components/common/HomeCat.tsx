import "../../styles/scss/components/common/homeCat.scss";
import pawLogo from "../../assets/img/pawLogo.png";
import welcomeCat from "../../assets/img/welcomeCat2.png";
import { useNavigate } from "react-router-dom";

const HomeCat = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <img className="logo" src={pawLogo} alt="나도있어고양이" onClick={() => navigate("/")} />

      <div className="title-container">
        <span>애묘인이 모이는 공간</span>
        <span>나도있어고양이</span>
      </div>

      <div className="rectangle">
        <img src={welcomeCat} alt="welcomeCat" />
        <div className="welcome-message">
          <span>가입하라냥</span>
        </div>
      </div>
      <div>태그 자리</div>
    </div>
  );
};

export default HomeCat;
