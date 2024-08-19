import React from "react";
import { useParams } from 'react-router-dom';
import { AiFillHeart } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { PiChatCircleBold } from "react-icons/pi";
import "../../styles/css/base/reset.css";
import "../../styles/css/pages/streetCat/streetCatDetail.css";
import { useStreetCatPost } from "../../hooks/useStreetCat";

const StreetCatDetail: React.FC = () => {
  const {id} = useParams();
  const postId = Number(id);

  const {data} = useStreetCatPost(postId);
  console.log(data);

  return (
    <>
      <section className="street-cat-detail-section">
        <div className="page-guide-box">
          <span className="page-guide">동네 고양이 도감</span>
        </div>

        <div className="cat-container">
          <span className="cat-name">샤인이</span>
          <div className="img-box">
            <img src="" alt="" />
          </div>

          <div className="cat-info">
            <div className="cat-tag">
              <span>암컷</span>
              <span>중성화 안 함</span>
              <span>2024년 7월 10일</span>
            </div>
            <div className="btn-box">
              <span className="like"><AiFillHeart /></span>
              <span className="more-btn"><HiOutlineDotsVertical /></span>
            </div>
          </div>

          <div className="cat-content">
            <p>
              게시글 내용 게시글 내용 😉
              동네 작은 동산에서 발견했어요. 순하고 애교 많은 성격인 것 같아요.
              간식 챙겨주니 잘 먹습니다 ^^
            </p>
          </div>
        </div>

        <div className="discovery-container">
          <span className="title">발견 장소</span>
          <span className="location">서울시 서대문구 연희동 연희로</span>
          <div className="map">

          </div>
        </div>

        <div className="user-container">
          <div className="user-img">
            <img src="" alt="" />
          </div>
          <div className="user-info">
            <span className="user-nickname">글쓴이 닉네임</span>
            <span className="created-date">2024년 7월 10일</span>
          </div>
        </div>
      </section>
      <div className="separation"></div>
      <section className="street-cat-comment-section">
        <div className="counts">
          <PiChatCircleBold /><span className="comment-count">3</span>
          <span>조회수</span><span className="view-count">29</span>
        </div>
        {/* 댓글 부분 */}
      </section>
    </>
  )
}

export default StreetCatDetail;