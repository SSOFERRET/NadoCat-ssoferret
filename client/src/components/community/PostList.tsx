import React from "react";
import CommunityCard from "./Post";
import { ICommunity } from "../../models/community.model";

interface Props {
  posts: any;
}

const CommunityList = ({ posts }: Props) => {
  return (
    <ul>
      {posts?.pages.map((group: { posts: ICommunity[] }, i: number) => (
        <React.Fragment key={i}>
          {group.posts.map((post: ICommunity) => (
            <CommunityCard key={post.postId} post={post} />
          ))}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default CommunityList;
