import "../../styles/css/components/comment/comments.css";
import useCommunityComment from "../../hooks/useCommunityComment";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import CommentList from "../comment/CommentList";
import CommentsEmpty from "../comment/CommentsEmpty";

interface IProps {
  postId: number;
}

const CommunityComments = ({ postId }: IProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } =
    useCommunityComment(postId);

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  if (isEmpty) {
    return <CommentsEmpty />;
  }

  return (
    <section className="comment-list">
      <CommentList comments={data} />

      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>
    </section>
  );
};

export default CommunityComments;
