import React from "react";
import "../../styles/css/components/community/postDetail.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { formatDate, formatViews } from "../../utils/format/format";
import Avartar from "./Avartar";
import { AiFillHeart } from "react-icons/ai";
import { PiChatCircleBold } from "react-icons/pi";
import Tags from "../common/Tags";
import { ICommunity } from "../../models/community.model";
import ImageCarousel from "../common/ImageCarousel";

interface IProps {
  post: ICommunity;
  commentCount: number;
}

const PostDetail = ({ post, commentCount }: IProps) => {
  return (
    <section className="post-details">
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
      {post.images.length && <ImageCarousel images={post.images} />}
      <Tags tags={post.tags} />
      <div className="post-info">
        <div className="likes">
          <AiFillHeart />
          <span>{post.likes}</span>
        </div>
        <div className="comment-count">
          <PiChatCircleBold />
          <span>{commentCount}</span>
        </div>
        <div className="views">
          조회수 <span>{formatViews(post.views)}</span>
        </div>
      </div>
      <pre className="post-content">{post.content}</pre>
    </section>
  );
};

export default PostDetail;
