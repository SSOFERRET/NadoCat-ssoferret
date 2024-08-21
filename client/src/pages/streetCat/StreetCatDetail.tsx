import React from "react";
import { useParams } from 'react-router-dom';
import { AiFillHeart } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { PiChatCircleBold } from "react-icons/pi";
import "../../styles/css/base/reset.css";
import "../../styles/scss/pages/streetCat/streetCatDetail.scss";
import { useStreetCatPost } from "../../hooks/useStreetCat";
import PostDetail from "../../components/streetCat/PostDetail";
import DiscoveryLocation from "../../components/streetCat/DiscoveryLocation";
import Author from "../../components/streetCat/Author";
import CommentsEmpty from "../../components/comment/CommentsEmpty";
import StreetCatComments from "../../components/streetCat/StreetCatComments";

const StreetCatDetail: React.FC = () => {
  const {id} = useParams();
  const postId = Number(id);

  const {data} = useStreetCatPost(postId);
  console.log(data)

  return (
    <>
      <section className="street-cat-detail-section">
        <div className="page-guide-box">
          <span className="page-guide">동네 고양이 도감</span>
        </div>
        
        <PostDetail {...data}/>
        <DiscoveryLocation location={data?.location}/>
        <Author users={data?.users} createdAt={data?.createdAt} name={data?.name}/>
      </section>

      <div className="separation"></div>

      <section className="street-cat-comment-section">
        <div className="counts">
          <PiChatCircleBold /><span className="comment-count">0</span>
          <span>조회수</span><span className="view-count">29</span>
        </div>
      
        <StreetCatComments postId={postId}/>
      </section>
    </>
  )
}

export default StreetCatDetail;