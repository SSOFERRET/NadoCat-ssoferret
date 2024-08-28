import BackButton from "../../components/common/BackButton";
import "../../styles/scss/pages/mypage/MyPage.scss";
import "../../styles/css/base/reset.css";
import Posts from "../../components/mypage/Posts";

export interface Post {
  title: string;
  contents: string;
  created_at: number;
  views: number;
  img?: string;
}

const MyPage = () => {
  
  return (
    <div className="myPage">
      <div className="header">
        <BackButton userName="" />
        <div id="title">관심글</div>
      </div>
      <Posts />
      </div>
  );
};

export default MyPage;
