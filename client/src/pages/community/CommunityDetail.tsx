import React from "react";
import "../../styles/css/pages/community/communityDetail.css";
import { formatAgo, formatDate } from "../../utils/format/format";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiFillHeart } from "react-icons/ai";
import { PiChatCircleBold } from "react-icons/pi";

const post = {
  postId: 4,
  categoryId: 1,
  title:
    "테스트용 제목 근데 길다?? 근데 길다??근데 길다??근데 길다??근데 길다??근데 길다??근데 길다??근데 길다??근데 길다??근데 길다??근데 길다??",
  content: `게시글 내용 게시글 내용 😉
귀여운 치즈 고양이 인절미 가래떡 치즈스틱 치즈볼 치즈어쩌구 저쩌구 귀여
운건 다 가진 치즈고양이 게시글 내용 게시글 내용 게시글 내용 게시글 내용 
게시글 내용 게시글 내용 게시글 내용 게시글 내용 `,
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

const comments = [
  {
    commentId: 2,
    comment: "댓글 등록 테스트~~~~~1111~",
    createdAt: "2024-08-13T09:13:11.000Z",
    updatedAt: "2024-08-13T09:13:11.000Z",
    users: {
      id: 1,
      uuid: "2f4c4e1d3c6d4f28b1c957f4a8e9e76d",
      nickname: "test",
      profileImage: "test",
    },
  },
  {
    commentId: 3,
    comment: "댓글 등록 테스트~~~~~1111~",
    createdAt: "2024-08-13T09:13:11.000Z",
    updatedAt: "2024-08-13T09:13:11.000Z",
    users: {
      id: 1,
      uuid: "2f4c4e1d3c6d4f28b1c957f4a8e9e76d",
      nickname: "test",
      profileImage: "test",
    },
  },
  {
    commentId: 4,
    comment: `관리를 열심히 해주시는 것 같아요
털 결이 부드러워 보입니다!`,
    createdAt: "2024-08-13T09:13:11.000Z",
    updatedAt: "2024-08-13T09:13:11.000Z",
    users: {
      id: 1,
      uuid: "2f4c4e1d3c6d4f28b1c957f4a8e9e76d",
      nickname: "test",
      profileImage: null,
    },
  },
  {
    commentId: 5,
    comment: "댓글 등록 테스트~~~~~1111~",
    createdAt: "2024-08-13T09:13:11.000Z",
    updatedAt: "2024-08-13T09:13:11.000Z",
    users: {
      id: 1,
      uuid: "2f4c4e1d3c6d4f28b1c957f4a8e9e76d",
      nickname: "test",
      profileImage: "test",
    },
  },
];

// CHECKLIST
// [ ] 댓글 컴포넌트 분리
// [ ] 유저 정보 컴포넌트 분리(user)
// [ ] 댓글 수 동적으로..
// [ ] 이미지 캐러셀로

const CommunityDetail = () => {
  return (
    <div className="community-detail">
      <div className="category">
        <span>커뮤니티</span>
      </div>
      <section className="contents">
        <div className="user">
          <div className="avatar">
            {post.users.profileImage && (
              <img src={post.users.profileImage} alt={post.users.nickname} />
            )}
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="nickname">{post.users.nickname}</span>
              <span className="date">{formatDate(post.createdAt)}</span>
            </div>
            <HiOutlineDotsVertical className="options-icon" />
          </div>
        </div>

        <span className="post-title">{post.title}</span>
        <div className="image"></div>
        <div className="tags">
          {post.tags.map((tag) => (
            <span className="tag" key={tag.tagId}>
              &#035; {tag.tag}
            </span>
          ))}
        </div>
        <div className="post-info">
          <div className="likes">
            <AiFillHeart />
            <span>{post.likes}</span>
          </div>
          <div className="comment-count">
            <PiChatCircleBold />
            <span>댓글 수</span>
          </div>
          <div className="views">
            조회수 <span>{post.views}</span>
          </div>
        </div>
        <pre className="post-content">{post.content}</pre>
      </section>
      <section className="comment-list">
        {comments.map((comment: any) => (
          <div className="comment-card">
            <div className="comment">
              <div className="avatar">
                {comment.users.profileImage && (
                  <img
                    src={comment.users.profileImage}
                    alt={comment.users.nickname}
                  />
                )}
              </div>
              <div className="detail">
                <span className="nickname">{comment.users.nickname}</span>
                <span className="date">{formatAgo(comment.updatedAt)}</span>
                <pre className="comment-detail">{comment.comment}</pre>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CommunityDetail;
