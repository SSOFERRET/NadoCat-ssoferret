import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PiChatCircleBold } from "react-icons/pi";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCatDetail.scss";
import { useReadStreetCatPost } from "../../hooks/useStreetCat";
import PostDetail from "../../components/streetCat/PostDetail";
import DiscoveryLocation from "../../components/streetCat/DiscoveryLocation";
import Author from "../../components/streetCat/Author";
import StreetCatComments from "../../components/streetCat/StreetCatComments";
import LoadingCat from "../../components/loading/LoadingCat";
// import LoginModal from "../../components/common/LoginModal";

const StreetCatDetail: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);
  const { data, isLoading } = useReadStreetCatPost(postId);

  const [commentsCount, setCommentsCount] = useState<number>(0);

  if (isLoading) {
    return <LoadingCat />;
  }

  return (
    <>
      <section className="street-cat-detail-section">
        {/* <LoginModal /> */}
        <div className="detial-section">
          <div className="page-guide-box">
            <span className="page-guide">동네 고양이 도감</span>
          </div>
          <PostDetail {...data} />
          {data?.location && <DiscoveryLocation location={data?.location} />}
          <Author
            users={data?.users}
            createdAt={data?.createdAt}
            name={data?.name}
          />
        </div>
      </section>

      <div className="separation"></div>

      <section className="street-cat-comment-section">
        <div className="counts">
          <PiChatCircleBold />
          <span className="comment-count">{commentsCount}</span>
          <span>조회수</span>
          <span className="view-count">0</span>
        </div>

        <StreetCatComments
          postId={postId}
          commentsCountUpdate={setCommentsCount}
        />
      </section>
    </>
  );
};

export default StreetCatDetail;
