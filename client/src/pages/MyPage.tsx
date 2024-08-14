import React, { useEffect, useState } from 'react';
import BackButton from '../components/common/BackButton';
import './MyPage.scss';
import Posts from '../components/mypage/Posts';
import test from "../../src/assets/img/test.png";

interface Post {
  title: string;
  contents: string;
  time: number;
  views: number;
  img?: string;
}
const MyPage: React.FC = () => {
  const lists: Post[] = [
    {
      title: "게시글 제목",
      contents: "이미지를 첨부하지 않으면 본문 내용이 좀 더 길게 보일 수 있다 본문 내용룰루랄라아랑라알앙기모띠 양",
      time: 45,
      views: 34,
      img: "../../assets/img/Rectangle-13.png"
    },
    {
      title: "게시글 제목",
      contents: "주변에 괜찮은 고양이 병원 있나요?? 추천해주세용",
      time: 45,
      views: 34
    },
    {
      title: "이미지가 없고 제목이 길면, 이미지가 없고 제목이 길면, 이미지가 없고 제목이 길면 내용이 밀려서 안 보임",
      contents: "",
      time: 45,
      views: 34,
      img: "../../src/assets/img/test.png",
    },
    {
      title: "게시글 제목 들어가는 자리",
      contents: "게시글 내용이 길어지면 예시 게시글 내",
      time: 45,
      views: 34
    },
    {
      title: "고양이도 에어컨을 좋아하네요",
      contents: "에어컨만 틀면 거실로 나옵니다. 더위 타는 건 다 똑같나봐요.. 나도 에어컨 좋아하는데 자유도 좋아고ㅗ... 에어컨은 누구에게나 사랑받는 존재인것 같네요....",
      time: 45,
      views: 1,
      img: "../../src/assets/img/test.png",
    },
    {
      title: "게시글 제목 들어가는 자리",
      contents: "게시글 내용이 길어지면 예시 게시글 내",
      time: 45,
      views: 34
    },{
      title: "게시글 제목 들어가는 자리",
      contents: "게시글 내용이 길어지면 예시 게시글 내",
      time: 45,
      views: 34
    },
    {
      title: "게시글 제목 들어가는 자리",
      contents: "게시글 내용이 길어지면 예시 게시글 내",
      time: 45,
      views: 34,
      img: "../../src/assets/img/test2.png"
    },{
      title: "게시글 제목 들어가는 자리",
      contents: "게시글 내용이 길어지면 예시 게시글 내",
      time: 45,
      views: 34
    },
    {
      title: "게시글 제목 들어가는 자리",
      contents: "게시글 내용이 길어지면 예시 게시글 내",
      time: 45,
      views: 34
    }
  ]

  return (
    <div className="myPage">
      <div className="header">
        <BackButton />
        <div id="title">관심글</div>
      </div>
      <Posts lists={lists}/>
    </div>
  );
};

export default MyPage;

