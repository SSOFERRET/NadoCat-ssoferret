import "../../styles/scss/components/comment/commentError.scss";
import ExclamationMarkCat from "../../assets/img/exclamationMarkCat.png";

const CommentError = () => {
  return (
    <div className="comments-error">
      <img src={ExclamationMarkCat} alt="Comments Error Cat" />
      <span>댓글을 불러올 수 없습니다.</span>
      <span>나중에 다시 시도해 주세요.</span>
    </div>
  );
};

export default CommentError;
