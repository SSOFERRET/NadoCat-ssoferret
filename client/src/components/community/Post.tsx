import React from "react";
import { ICommunity } from "../../models/community.model";

interface Props {
  post: ICommunity;
}

const CommunityCard = ({ post }: Props) => {
  return (
    <li>
      <div>
        <p>{post.title}</p>
        <p>{post.content}</p>
        <div>
          <p>{post.createdAt}</p>
          <p>{post.views}</p>
        </div>
      </div>
      <div>이미지 자리</div>
    </li>
  );
};

export default CommunityCard;
