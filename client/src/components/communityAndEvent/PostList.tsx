import React from "react";
import Post from "./Post";
import { ICommunity, ICommunityPage } from "../../models/community.model";
import { InfiniteData } from "@tanstack/react-query";
import { IEvent } from "../../models/event.model";
import { IMissing, IMissingPosts } from "../../models/missing.model";
import MissingPost from "../missing/MissingPost";

interface IProps {
  posts: InfiniteData<TCategory> | undefined;
}

type TCategory = IMissingPosts | ICommunityPage;

const PostList = ({ posts }: IProps) => {
  const isMissing = (post: IMissing | ICommunity | IEvent): boolean =>
    (post as IMissing).missingCats ? true : false;

  return (
    <ul className="list">
      {posts?.pages.map((group: TCategory, i: number) => (
        <React.Fragment key={i}>
          {group.posts.map((post: IMissing | ICommunity | IEvent) => {
            return isMissing(post) ? (
              <>
                <MissingPost key={post.postId} post={post as IMissing} />
              </>
            ) : (
              <Post key={post.postId} post={post as ICommunity | IEvent} />
            );
          })}
        </React.Fragment>
      ))}
    </ul>
  );
};

// 백업

// interface IProps {
//   posts: InfiniteData<ICommunityPage> | undefined;
// }

// const PostList = ({ posts }: IProps) => {
//   return (
//     <ul className="list">
//       {posts?.pages.map((group: ICommunityPage, i: number) => (
//         <React.Fragment key={i}>
//           {group.posts.map((post: ICommunity | IEvent) => (
//             <Post key={post.postId} post={post} />
//           ))}
//         </React.Fragment>
//       ))}
//     </ul>
//   );
// };

export default PostList;
