import React from "react";
import Post from "./Post";
import "../../styles/scss/components/communityAndEvent/postList.scss";
import { ICommunity, ICommunityPage } from "../../models/community.model";
import { InfiniteData } from "@tanstack/react-query";
import { IEvent } from "../../models/event.model";

interface IProps {
  posts: InfiniteData<ICommunityPage> | undefined;
}

const PostList = ({ posts }: IProps) => {
  return (
    <ul className="list">
      {posts?.pages.map((group: ICommunityPage, i: number) => (
        <React.Fragment key={i}>
          {group.posts.map((post: ICommunity | IEvent) => (
            <Post key={post.postId} post={post} />
          ))}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default PostList;
