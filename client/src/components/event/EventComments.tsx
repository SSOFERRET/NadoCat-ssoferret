import React from "react";
import "../../styles/css/components/community/comments.css";
import useEventComment from "../../hooks/useEventComment";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import CommentsEmpty from "../community/CommentsEmpty";
import CommentList from "../community/CommentList";

interface IProps {
  postId: number;
}

const EventComments = ({ postId }: IProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } =
    useEventComment(postId);

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

export default EventComments;
