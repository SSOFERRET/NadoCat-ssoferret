import { useEffect, useRef, useState } from "react";
import { getMyPosts } from "../../../api/user.api";
import { useAuthStore } from "../../../store/userStore";
import { useNavigate } from "react-router-dom";
import PostEmpty from "../../communityAndEvent/PostEmpty";
import { formatAgo, formatViews } from "../../../utils/format/format";

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
        if (data) {
          setPosts((prevPosts) => [...prevPosts, ...data]);
          if (data.length < 10) {
            setAddPage(false);
          }
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

  // const dateChanger = (isoString: string) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleDateString("ko-KR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   });
  // };

  console.log("posts",posts);

  return (
    <>
      <ul className="myPosts-list">
        {posts.length > 0 ? (
          posts.map((post, index) =>
            index === posts.length - 1 ? (
              <li key={post.postId} className="board-post" onClick={() => navigate(`/boards/communities/${post.postId}`)}>
                <div className="board-post-info">
                  <div className="post-title-container">
                    <span className="post-title">{post.title}</span>
                  </div>

                  <span className="post-content">{post.content}</span>

                  <div className="post-meta">
                    <span>{formatAgo(post.updatedAt)}</span>
                    <span>&middot;</span>
                    <span className="post-views">조회 {formatViews(post.views)}</span>
                  </div>
                </div>
                <div className="post-image">{post.thumbnail && <img src={post.thumbnail} alt={post.title} />}</div>
              </li>
            ) : (
              <li key={post.postId} className="board-post" onClick={() => navigate(`/boards/communities/${post.postId}`)}>
                <div className="board-post-info">
                  <div className="post-title-container">
                    <span className="post-title">{post.title}</span>
                  </div>

                  <span className="post-content">{post.content}</span>

                  <div className="post-meta">
                    <span>{formatAgo(post.updatedAt)}</span>
                    <span>&middot;</span>
                    <span className="post-views">조회 {formatViews(post.views)}</span>
                  </div>
                </div>
                <div className="post-image">{post.thumbnail && <img src={post.thumbnail} alt={post.title} />}</div>
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
