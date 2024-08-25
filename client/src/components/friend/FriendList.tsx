import React from "react";
import Friend from "./Friend";
import { IFriend, IFriendPage } from "../../models/friend.model";
import { InfiniteData } from "@tanstack/react-query";

interface IProps {
  friends: InfiniteData<IFriendPage> | undefined;
}

const FriendList = ({ friends }: IProps) => {
  return (
    <ul className="frienddList">
      {friends?.pages.map((group: IFriendPage, i: number) => (
        <React.Fragment key={i}>
          {group.follows.map((friend: IFriend) => (
            <Friend friend={friend} />
          ))}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default FriendList;
