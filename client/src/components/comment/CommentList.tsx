import React from "react";
import Comment from "../comment/Comment";
import { IComment, ICommentPage } from "../../models/comment.model";
import { InfiniteData } from "@tanstack/react-query";

interface IProps {
  comments: InfiniteData<ICommentPage> | undefined;
}

const CommentList = ({ comments }: IProps) => {
  return (
    <>
      {comments?.pages.map((group: ICommentPage, i: number) => (
        <React.Fragment key={i}>
          {group.comments.map((comment: IComment) => (
            <Comment key={comment.commentId} comment={comment} />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default CommentList;
