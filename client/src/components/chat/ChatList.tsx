import React, { useState } from 'react';
import "./ChatList.scss";
import "../../styles/css/base/reset.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';
import DefaultImg from "../../assets/img/DefaultImg.png";

interface IList{
  img: string;
  users: {
    nickname: string;
  }
  messages: {
    content: string;
    sentAt: string;
  }[];
  otherUuid: {
    data: number[];
  };
  uuid: {
    data: number[];
  };
  chatId: string;
}

interface ChatProps {
  lists: IList[];
}

const ChatList: React.FC<ChatProps> = ({ lists }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedChatId, setSelectedChatId] = useState<string|null>(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setModalOpen(false);
  }
  const handleIconClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); 
    setSelectedChatId(chatId)
    console.log(chatId);
    setModalOpen(true);

  }
  const handleChatClick = (uuid: number[], otherUuid: number[], chatId: string) => {
    navigate("/chats/chat", { state: { uuid, otherUuid, chatId } });
  }

  const now: Date = new Date();

  const getTimeDifference = (sentAt: string) => {
    const messageTime = new Date(sentAt);
    const timeDifference = now.getTime() - messageTime.getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };
  return (
    <div className="chatlist">
      {lists.map((list, index) => (
        <div className="listbox" key={index} onClick={ () =>handleChatClick(list.uuid.data, list.otherUuid.data, list.chatId) }>
          <div className="imgbox">{list.img ?<img src={list.img} /> : <img src={DefaultImg} /> }</div>
          <div className="contentsbox">
            <div className="nametimebox">
              <div className="nickname">{list.users.nickname}</div>
              <div className="time">{getTimeDifference(list.messages.at(-1).sentAt)}</div>
            </div>
            <div className="contents">{list.messages.at(-1)?.content }</div>
          </div>
          <div className="iconbox">
            <BsThreeDotsVertical className="icon" onClick={(e) => handleIconClick(e, list.chatId)}/>
          </div>
        </div>
      ))}
      <Modal isOpen={modalOpen} onClosed={handleClose} chatId={selectedChatId}/>
    </div>
  );
};

export default ChatList;