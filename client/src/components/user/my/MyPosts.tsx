import React, { useEffect, useRef, useState } from "react";
import { getMyPosts } from "../../../api/user.api";
import { useAuthStore } from "../../../store/userStore";
import { useNavigate } from "react-router-dom";
import PostEmpty from "../../communityAndEvent/PostEmpty";

export interface MyPostsProps {
  title: string;
  content: string;
  updatedAt: string;
  views: number;
  postId: number;
  thumbnail?: string;
}

export const MyPosts = () => {
  const { uuid } = useAuthStore(); // 현재 로그인한 사용자의 UUID
  const [posts, setPosts] = useState<MyPostsProps[]>([]);
  const [page, setPage] = useState(1);
  const [addPage, setAddPage] = useState(true);
  const navigate = useNavigate();

  const observer = useRef<IntersectionObserver>();
  const lastPostElementRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getMyPosts(uuid);
        setPosts((prevPosts) => [...prevPosts, ...data]);
        if (data.length < 10) {
          setAddPage(false);
        }
      } catch (error) {
        console.error("작성한 글을 가져오는 중 오류 발생:", error);
      }
    };

    if (uuid) {
      fetchPosts();
    }
  }, [uuid, page]);

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

  const dateChanger = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  return (
    <>
  <ul className="list">
  {posts.length > 0 ? (
        posts.map((post, index) =>
          index === posts.length - 1 ? (
            <li
              key={index}
              className="postBox"
              onClick={() => navigate(`/boards/communities/${post.postId}`)}
              ref={lastPostElementRef}
            >
              <div className="post-item">
                <h3 className="title">{post.title}</h3>
                <p className="contents">{post.content}</p>
                <p className="time">
                  {dateChanger(post.updatedAt)} • 조회 {post.views}
                </p>
              </div>
              {post.thumbnail && (
                <div className="postsImg">
                  <img className="img" src={post.thumbnail} alt="thumbnail" />
                </div>
              )}
            </li>
          ) : (
            <li
              key={index}
              className="postBox"
              onClick={() => navigate(`/boards/communities/${post.postId}`)}
            >
              <div className="post-item">
                <h3 className="title">{post.title}</h3>
                <p className="contents">{post.content}</p>
                <p className="time">
                  {dateChanger(post.updatedAt)} • 조회 {post.views}
                </p>
              </div>
              {post.thumbnail && (
                <div className="postsImg">
                  <img className="img" src={post.thumbnail} alt="thumbnail" />
                </div>
              )}
            </li>
          )
        )
      ) : (
        <PostEmpty />
      )}
      </ul>
    </>
  );
};

export default MyPosts;
