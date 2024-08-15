import React from "react";
import "../../styles/css/pages/community/communityDetail.css";

const post = {
  postId: 4,
  categoryId: 1,
  title: "테스트용 제목",
  content: "테스트용 내용4",
  views: 0,
  createdAt: "2024-08-13T12:20:54.000Z",
  updatedAt: "2024-08-13T12:20:54.000Z",
  users: {
    id: 1,
    uuid: "2f4c4e1d3c6d4f28b1c957f4a8e9e76d",
    nickname: "test",
    profileImage: null,
  },
  tags: [
    {
      tagId: 14,
      tag: "테스트다",
    },
    {
      tagId: 15,
      tag: "태그 테스트",
    },
    {
      tagId: 16,
      tag: "이것은 태그",
    },
  ],
  images: [
    {
      imageId: 6,
      url: "https://image1",
    },
  ],
  likes: 0,
  liked: false,
};

// CHECKLIST
// [ ] 댓글 컴포넌트 분리
// [ ] 유저 정보 컴포넌트 분리
// [ ]

const CommunityDetail = () => {
  return (
    <div className="community-detail">
      <div className="category">
        <span>커뮤니티</span>
      </div>
      <section>
        <div className="user-info">
          <div className="avatar">
            {post.users.profileImage && (
              <img src={post.users.profileImage} alt={post.users.nickname} />
            )}
          </div>
          <div className="">
            <span>{post.users.nickname}</span>
            <span>{post.createdAt}</span>
          </div>
        </div>
        <div className="image"></div>
        <div className="tags"></div>
        <div className="post-info">
          <span>{post.likes}</span>
          <span>댓글 수</span>
          <span>{post.views}</span>
        </div>
        <div>{post.content}</div>
      </section>
      <section className="comments"></section>
    </div>
  );
};

export default CommunityDetail;
