import React from "react";
import "../../styles/scss/components/streetCat/author.scss";

interface IUsers {
  users?: {
    uuid: {
      type: Buffer;
      data: number[];
    }
    nickname: string;
    profileImage: string;
  }
  createdAt?: Date;
  name?: string;
}

const Author = (props: IUsers) => {
  const displayDate = props.createdAt ? new Date(props.createdAt).toLocaleDateString() : "";

  return (
    <>
      <span className="user-guide-title">{props.name} 등록한 동네집사</span>
      <div className="user-container">
          <div className="user-img">
            <img src={props.users?.profileImage} alt="profileImage" />
          </div>
          <div className="user-info">
            <span className="user-nickname">{props.users?.nickname}</span>
            <span className="created-date">{displayDate}</span>
          </div>
        </div>
    </>
  )
}

export default Author;