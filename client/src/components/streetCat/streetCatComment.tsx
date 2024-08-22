import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PostMenu from "../communityAndEvent/PostMenu";

interface IUser {
  uuid: {
    data: number[];
  };
  nickname: string;
  profileImage: string;
}

interface IComment {
  streetCatCommentId: number;
  comment: string;
  createdAt: string;
  users: IUser;
}

interface IStreetCatCmmentProps {
  comments: IComment[];
  postId: number;
}

const StreetCatCmment: React.FC<IStreetCatCmmentProps> = ({ comments, postId }) => {
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = (commentId: number | null) => {
    setSelectedCommentId(commentId);
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {comments.map((comment) => (
        <div className="street-cat-comment" key={comment.streetCatCommentId}>
          <div className="user-img">
            <img
              src={comment.users.profileImage}
              alt="profileImage"
            />
          </div>
          <div className="user-info">
            <div className="user-profile">
              <span className="nickname">{comment.users.nickname}</span>
              <span className="date">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="content">{comment.comment}</p>
          </div>
          <HiOutlineDotsVertical className="comment-more" onClick={() => toggleMenu(comment.streetCatCommentId)}/>
            {isMenuOpen && selectedCommentId === comment.streetCatCommentId && (
              <PostMenu
                boardType="streetCat"
                menuType="comment"
                postId={postId}
                commentId={comment.streetCatCommentId}
                isShowMenu={isMenuOpen}
                showMenu={() => setMenuOpen(false)}
              />
            )}
        </div>
      ))}
    </>
  );
};

export default StreetCatCmment;
