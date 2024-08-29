import React from "react";
import "../../styles/scss/components/user/Posts.scss";
import "../../styles/css/base/reset.css";
import NoLike from "../../assets/img/NoLike.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/userStore";
import { myInterests } from "../../api/user.api";
import { formatAgo, formatViews } from "../../utils/format/format";

export interface Post {
  title: string;
  content: string;
  updatedAt: string;
  views: number;
  postId: number;
  thumbnail?: string;
}

const Posts: React.FC = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<Post[]>([]);

  const { uuid } = useAuthStore();
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const interestPosts = await myInterests();
        setLists(interestPosts);
      } catch (error) {
        console.error("관심글 불러오기 에러: ", error);
      }
    };

    if (uuid) {
      fetchInterests();
    }
  }, [uuid]);

  // const dateChanger = (isoString: string) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleDateString("ko-KR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   });
  // };

  return (
    <div className="background">
      {lists.length ? (
        lists.map((list, index) => (
          <li key={index} className="board-post" onClick={() => navigate(`/boards/communities/${list.postId}`)}>
            <div className="board-post-info">
              <div className="post-title-container">
                <span className="post-title">{list.title}</span>
              </div>

              <span className="post-content">{list.content}</span>

              <div className="post-meta">
                <span>{formatAgo(list.updatedAt)}</span>
                <span>&middot;</span>
                <span className="post-views">조회 {formatViews(list.views)}</span>
              </div>
            </div>
            <div className="post-image">{list.thumbnail && <img data-src={list.thumbnail} alt={list.title} />}</div>
          </li>
        ))
      ) : (
        <img src={NoLike} className="nolike" />
      )}
    </div>
  );
};

export default Posts;

// <div key={index} className="postsBox" onClick={() => navigate(`/boards/communities/${list.postId}`)}>
//   {/* <div className={`postsContents ${list.thumbnail ? "withImg" : "withoutImg"}`}> */}
//   <div className={`postsContents ${list.thumbnail ? "withImg" : "withoutImg"}`}>
//     <b className="title">{list.title}</b>
//     <p className="contents">{list.content}</p>
//     <p id="time">
//       {dateChanger(list.updatedAt)} • 조회 {list.views}
//            // <div key={index} className="postsBox" onClick={() => navigate(`/boards/communities/${list.postId}`)}>
//   {/* <div className={`postsContents ${list.thumbnail ? "withImg" : "withoutImg"}`}> */}
//   <div className={`postsContents ${list.thumbnail ? "withImg" : "withoutImg"}`}>
//     <b className="title">{list.title}</b>
//     <p className="contents">{list.content}</p>
//     <p id="time">
//       {dateChanger(list.updatedAt)} • 조회 {list.views}
//     </p>
//   </div>
//   <div className="postsImg">{list.thumbnail && <img src={list.thumbnail} alt={list.title} />}</div>
// </div>
