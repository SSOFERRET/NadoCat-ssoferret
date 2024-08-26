import "../../styles/scss/components/communityAndEvent/postEmpty.scss";
import CommentsEmptyCat from "../../assets/img/commentsEmpty.png";

interface IProps {
  text?: string;
}

const PostEmpty = ({ text = "작성된 게시글이 없습니다." }: IProps) => {
  return (
    <div className="post-empty">
      <img src={CommentsEmptyCat} alt="Comments Empty Cat" />
      <span>{text}</span>
    </div>
  );
};

export default PostEmpty;
