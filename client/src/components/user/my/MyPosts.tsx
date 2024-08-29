import React, { useEffect, useRef, useState } from "react";
import { getMyPosts } from "../../../api/user.api";
import { useAuthStore } from "../../../store/userStore";

export interface MyPostsProps {
postId?: number;
title?: string;
content?: string;
page?: number;
pageSize?: number;
}

export const MyPosts = ({}) => {
  const { uuid } = useAuthStore(); // 현재 로그인한 사용자의 UUID
  const [posts, setPosts] = useState<MyPostsProps[]>([]);
  const [page, setPage] = useState(1);
  const [addPage, setAddPage] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastPostElementRef = useRef(null);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       // const data = await getMyPosts(page, 10);
  //       const data = await getMyPosts(page);
  //       setPosts((prevPosts) => [...prevPosts, ...data]);
  //       if (data.length < 10) {
  //         setAddPage(false);
  //       }
  //     } catch (error) {
  //       console.error("작성한 글을 가져오는 중 오류 발생:", error);
  //     }
  //   };

  //   if (uuid) {
  //     fetchPosts();
  //   }
  // }, [uuid, page]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && addPage) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [addPage]);

  return (
    <>
      <div className="my-posts">
        {posts.map((post, index) =>
          index === posts.length - 1 ? (
            <div key={post.postId} ref={lastPostElementRef} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ) : (
            <div key={post.postId} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default MyPosts;
