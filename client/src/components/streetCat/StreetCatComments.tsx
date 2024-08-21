import { useStreetCatComments } from "../../hooks/useStreetCatComments";
import CommentList from "../comment/CommentList";
import CommentsEmpty from "../comment/CommentsEmpty";
import { useIntersectionObserver } from "./IntersectionObserver";

interface IProps {
  postId: number;
}

const StreetCatComments = ({postId}: IProps) => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isEmpty 
  } = useStreetCatComments(postId);

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

  console.log(data);
  return (
    <section className="comment-list">
      {/* <CommentList comments={data} /> */}

      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>
    </section>
  );
}

export default StreetCatComments;