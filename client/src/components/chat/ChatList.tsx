import React, { useState } from 'react';
import "./ChatList.scss";
import "../../styles/css/base/reset.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import Modal from "./Modal";
interface IList{
  img: string;
  nickname: string;
  contents: string;
  time: string;
}

interface ChatProps {
  lists: IList[]
}
const ChatList: React.FC<ChatProps> = ({lists}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleClose = () => {
    setModalOpen(false);
  }
  return (
    <div className="chatlist">
      {lists.map((list) => (
        <div className="listbox">
          <div className="imgbox"><img src={list.img} /></div>
          <div className="contentsbox">
            <div className="nametimebox">
              <div className="nickname">{list.nickname}</div>
              <div className="time">{list.time}</div>
            </div>
            <div className="contents">{list.contents}</div>
          </div>
          <BsThreeDotsVertical className="icon" onClick={() => setModalOpen(true)}/>
        </div>
      ))}
      <Modal isOpen={modalOpen} onClosed={handleClose}/>
    </div>
  );
};

export default ChatList;