import React from "react";
import Comment from "../comment/Comment";
import { IComment, ICommentPage } from "../../models/comment.model";
import { InfiniteData } from "@tanstack/react-query";
import { ICommentPutRequest } from "../../api/community.api";

interface IProps {
  postId: number;
  comments: InfiniteData<ICommentPage> | undefined;
  showMenu: () => void;
  isCommentEdit: boolean;
  setIsCommentEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editComment: ({ postId, userId, comment, commentId }: ICommentPutRequest) => Promise<void>;
}

const CommentList = ({ postId, comments, showMenu, isCommentEdit, setIsCommentEdit, editComment }: IProps) => {
  return (
    <>
      {comments?.pages.map((group: ICommentPage, i: number) => (
        <React.Fragment key={i}>
          {group.comments.map((comment: IComment) => (
            <Comment
              key={comment.commentId}
              postId={postId}
              comment={comment}
              showMenu={showMenu}
              isCommentEdit={isCommentEdit}
              setIsCommentEdit={setIsCommentEdit}
              editComment={editComment}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default CommentList;
