import "../../styles/scss/components/communityAndEvent/postEmpty.scss";
import CommentsEmptyCat from "../../assets/img/commentsEmpty.png";

const PostEmpty = () => {
  return (
    <div className="post-empty">
      <img src={CommentsEmptyCat} alt="Comments Empty Cat" />
      <span>작성된 게시글이 없습니다.</span>
    </div>
  );
};

export default PostEmpty;
