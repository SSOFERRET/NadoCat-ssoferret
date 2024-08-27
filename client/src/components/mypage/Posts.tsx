import React from "react";
import "../../styles/scss/components/user/Posts.scss";
import "../../styles/css/base/reset.css";
import NoLike from "../../assets/img/NoLike.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
export interface Post {
  title: string;
  content: string;
  updatedAt: string;
  views: number;
  postId: number;
  thumbnail?: string;
}

const ENDPOINT = "http://localhost:8080";

const Posts: React.FC = () => {
  const navigate = useNavigate();

  const [lists, setLists] = useState<Post[]>([]);

  const uuid = localStorage.getItem("uuid");

  useEffect(() => {
    axios.post(ENDPOINT + "/boards/Interests", {
      userId: uuid
    })
    .then(response => {
      setLists(response.data);
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  const dateChanger = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
  console.log(lists)
  return (
    <div className="background">
      {
        lists.length ?
        lists.map((list, index) => (
          <div key={index} className="postsBox" onClick={() => navigate(`/boards/communities/${list.postId}`)}>
            <div className={`postsContents ${list.thumbnail ? "withImg" : "withoutImg"}`}>
              <b className="title">{list.title}</b>
              <p className="contents">{list.content}</p>
              <p id="time">{dateChanger(list.updatedAt)} • 조회 {list.views}</p>
            </div>
            {list.thumbnail && (
                <div className="postsImg"><img className="img"src={list.thumbnail} /></div>
            )}
          </div>
        )):
        <img src={NoLike} className="nolike" />
      }
    </div>
    
  );
};

export default Posts;