import React, { useEffect, useState } from "react";
import BackButton from "../../components/common/BackButton";
import "../../styles/scss/pages/mypage/MyPage.scss";
import "../../styles/css/base/reset.css";
import Posts from "../../components/mypage/Posts";
import axios from "axios";
import { useAuthStore } from "../../store/userStore";
import NoLike from "../../assets/img/NoLike.png";

export interface Post {
  title: string;
  contents: string;
  created_at: number;
  views: number;
  img?: string;
}

const ENDPOINT = "http://localhost:8080"
const MyPage: React.FC = () => {
  const [lists, setLists] = useState<Post[]>([]);

  const uuid = localStorage.getItem("uuid");
  const generalToken = localStorage.getItem("generalToken");
  const refreshToken = localStorage.getItem("refreshToken");
  
  try{
    axios.post(ENDPOINT + "/boards/Interests", {
      userId: uuid
    }, {
      headers: {
        Authorization: `Bearer ${generalToken}`
      }
    })
    .then(response => {
      setLists(response.data);
      console.log(response.data);
    })
  } catch(error){
    console.log("뭐가 문제인지 한 번 보자" + error)
  }
  
  return (
    <div className="myPage">
      <div className="header">
        <BackButton userName=''/>
        <div id="title">관심글</div>
      </div>
      <Posts lists={lists}/>:
      </div>
  );
};

export default MyPage;

