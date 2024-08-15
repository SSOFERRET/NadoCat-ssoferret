import React from "react";
import "../../styles/css/pages/community/communityDetail.css";
import { formatDate, formatViews } from "../../utils/format/format";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiFillHeart } from "react-icons/ai";
import { PiChatCircleBold } from "react-icons/pi";
import Comments from "../../components/community/Comments";
import Avartar from "../../components/community/Avartar";
import useCommunity from "../../hooks/useCommunity";
import { useParams } from "react-router-dom";
import Tags from "../../components/common/Tags";

// CHECKLIST
// [ ] 댓글 컴포넌트 분리
// [ ] 유저 정보 컴포넌트 분리(user)
// [ ] 댓글 수 동적으로..
// [ ] 이미지 캐러셀로

const CommunityDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const { data: post } = useCommunity(postId);
  return (
    <>
      {post && (
        <div className="community-detail">
          <div className="category">
            <span>커뮤니티</span>
          </div>
          <section className="contents">
            {post?.users && (
              <div className="user">
                <Avartar
                  profileImage={post.users.profileImage}
                  nickname={post.users.nickname}
                />
                <div className="user-info">
                  <div className="user-details">
                    <span className="nickname">{post.users.nickname}</span>
                    <span className="date">{formatDate(post.createdAt)}</span>
                  </div>
                  <HiOutlineDotsVertical className="options-icon" />
                </div>
              </div>
            )}
            <span className="post-title">{post.title}</span>
            <div className="image"></div>
            <Tags tags={post.tags} />
            <div className="post-info">
              <div className="likes">
                <AiFillHeart />
                <span>{post.likes}</span>
              </div>
              <div className="comment-count">
                <PiChatCircleBold />
                <span>댓글 수</span>
              </div>
              <div className="views">
                조회수 <span>{formatViews(post.views)}</span>
              </div>
            </div>
            <pre className="post-content">{post.content}</pre>
          </section>
          <Comments postId={postId} />
        </div>
      )}
    </>
  );
};

export default CommunityDetail;
