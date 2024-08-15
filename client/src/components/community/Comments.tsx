import React from "react";
import "../../styles/css/components/community/comments.css";
import Avartar from "./Avartar";
import { formatAgo } from "../../utils/format/format";
import { IComment } from "../../models/comment.model";

const comments = [
  {
    commentId: 2,
    comment: "댓글 등록 테스트~~~~~1111~",
    createdAt: "2024-08-13T09:13:11.000Z",
    updatedAt: "2024-08-13T09:13:11.000Z",
    users: {
      id: 1,
      uuid: "2f4c4e1d3c6d4f28b1c957f4a8e9e76d",
      nickname:
        "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte sttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
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
    comment:
      "댓글 등록 테스트~~~~~1111~ 근데 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어 길어",
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

interface IProps {
  postId: number;
}

const Comments = ({ postId }: IProps) => {
  return (
    <section className="comment-list">
      {comments.map((comment: any) => (
        <div key={comment.commentId} className="comment-card">
          <div className="comment">
            <Avartar
              profileImage={comment.users.profileImage}
              nickname={comment.users.nickname}
            />
            <div className="detail">
              <span className="nickname">{comment.users.nickname}</span>
              <span className="date">{formatAgo(comment.updatedAt)}</span>
              <pre className="comment-detail">{comment.comment}</pre>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Comments;
