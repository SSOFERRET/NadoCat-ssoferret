import React /*, { useEffect, useState }*/ from "react";
import { useParams } from "react-router-dom";
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { PiChatCircleBold } from "react-icons/pi";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCatDetail.scss";
import { useReadStreetCatPost } from "../../hooks/useStreetCat";
import PostDetail from "../../components/streetCat/PostDetail";
import DiscoveryLocation from "../../components/streetCat/DiscoveryLocation";
import Author from "../../components/streetCat/Author";
// import CommentsEmpty from "../../components/comment/CommentsEmpty";
import StreetCatComments from "../../components/streetCat/StreetCatComments";
// import CommentForm from "../../components/comment/CommentForm";
// import MapBox from "../../components/streetCat/testComp";

const StreetCatDetail: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);
  const { data } = useReadStreetCatPost(postId);

  return (
    <>
      <section className="street-cat-detail-section">
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
          <PiChatCircleBold /><span className="comment-count">0</span>
          <span>조회수</span><span className="view-count">0</span>
        </div>

        <StreetCatComments postId={postId} />
      </section>
    </>
  );
};

export default StreetCatDetail;
