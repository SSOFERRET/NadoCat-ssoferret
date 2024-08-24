import React from 'react';
import "../../styles/scss/components/user/Posts.scss";
import "../../styles/css/base/reset.css";
interface Post {
  title: string;
  contents: string;
  created_at: number;
  views: number;
  img?: string;
}

interface PostsProps {
  lists: Post[]
}
const Posts: React.FC<PostsProps> = ({ lists }) => {
  return (
    <div className="background">
      {
        lists.map((list, index) => (
          <div key={index} className="postsBox">
            <div className={`postsContents ${list.img ? "withImg" : "withoutImg"}`}>
              <b className="title">{list.title}</b>
              <p className="contents">{list.contents}</p>
              <p id="time">{list.created_at} 전 • 조회 {list.views}</p>
            </div>
            {list.img && (
                <div className="postsImg"><img className="img"src={list.img} /></div>
            )}
          </div>
        ))
      }
    </div>
    
  );
};

export default Posts;