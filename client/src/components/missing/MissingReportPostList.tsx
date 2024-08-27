// import PostEmpty from "../communityAndEvent/PostEmpty";
// import PostList from "../communityAndEvent/PostList";
// import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
// import useMissings from "../../hooks/useMissings";
import "../../styles/scss/pages/missing/missing.scss";
// import useMissingReports from "../../hooks/useMissingReports";
import {
  IMissing,
  IMissingReport,
  IMissingReportPosts,
} from "../../models/missing.model";
import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import MissingReportPost from "./MissingReportPost";

interface IProps {
  posts: InfiniteData<IMissingReportPosts> | undefined;
  missing: IMissing;
}

const MissingReportPostList = ({ posts, missing }: IProps) => {
  return (
    <ul className="report-list">
      {posts?.pages.map((group: IMissingReportPosts, i: number) => (
        <React.Fragment key={i}>
          {group.posts.map((post: IMissingReport) => (
            <MissingReportPost
              key={post.postId}
              post={post as IMissingReport}
              missing={missing}
            />
          ))}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default MissingReportPostList;
