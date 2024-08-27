// import React from "react";
import { IFriend } from "../../models/friend.model";
import Avatar from "../common/Avatar";
import { RxCross1 } from "react-icons/rx";
import useFriend from "../../hooks/useFriend";

interface IProps {
  friend: IFriend;
}

const Friend = ({ friend }: IProps) => {
  const { unfollow } = useFriend();
  return (
    <li className="friend">
      <Avatar
        nickname={friend.nickname}
        profileImage={friend.profileImage}
        onClick={() => {}}
      />
      <div className="user-info">
        <span className="nickname">{friend.nickname}</span>
        <button
          className="friend-delete"
          onClick={() => unfollow(friend.userId)}
        >
          <RxCross1 />
        </button>
      </div>
    </li>
  );
};

export default Friend;
