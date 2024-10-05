import "../../styles/scss/components/comment/commentsEmpty.scss";
import CommentsEmptyCat from "../../assets/img/commentsEmpty.webp";

const CommentsEmpty = () => {
  return (
    <div className="comments-empty">
      <img src={CommentsEmptyCat} alt="Comments Empty Cat" />
      <span>작성된 댓글이 없습니다.</span>
    </div>
  );
};

export default CommentsEmpty;
