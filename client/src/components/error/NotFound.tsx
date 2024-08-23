import "../../styles/scss/components/error/notFound.scss";
import { useNavigate } from "react-router-dom";
import NotFoundCat from "../../assets/img/notFoundCat.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="cat">
        <img src={NotFoundCat} alt="Not Found" />
      </div>
      <div className="text">
        <p className="message">현재 찾을 수 없는 페이지 입니다.</p>
        <div className="detail">
          <p>존재하지 않는 주소를 입력하셨거나,</p>
          <p>요청하신 페이지의 주소가</p>
          <p>변경/삭제되어 찾을 수 없습니다.</p>
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => navigate(-1)}>이전 페이지</button>
        <button onClick={() => navigate("/")}>메인으로</button>
      </div>
    </div>
  );
};

export default NotFound;
