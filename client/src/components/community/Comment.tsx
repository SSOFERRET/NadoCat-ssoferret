import { IComment } from "../../models/comment.model";
import { formatAgo } from "../../utils/format/format";
import Avartar from "./Avartar";

interface IProps {
  comment: IComment;
}

const Comment = ({ comment }: IProps) => {
  return (
    <li key={comment.commentId} className="comment-card">
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
    </li>
  );
};

export default Comment;
