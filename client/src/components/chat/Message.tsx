import React from 'react';
import "../../styles/scss/components/chat/Message.scss";

interface MessageData {
  uuid: string;
  content: string;
  sentAt?: string;
}

interface Props {
  message: MessageData; 
}

const Message: React.FC<Props> = ({ message: { uuid, content, sentAt }}) => {
  const isSentByCurrentUser = uuid === localStorage.getItem("uuid");

  function formatTime(sentAt: string) {
    const date = new Date(sentAt);
    console.log(sentAt);
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; 
    
    return `${ampm} ${formattedHours}시 ${formattedMinutes}분`;
  }

  return isSentByCurrentUser ? (
    <div className="messageWrapper justifyEnd">
      <p className='messageTime justifyEnd'>{formatTime(sentAt || "")}</p>
      <div className='messageContainer justifyEnd'>
        <p className='messageText justifyEnd'>{content}</p>
      </div>
    </div>
  ) : (
    <div className="messageWrapper justifyStart">
      <div className='messageContainer justifyStart'>
        <p className='messageText justifyStart'>{content}</p>
      </div>
      <p className='messageTime justifyStart'>{formatTime(sentAt || "")}</p>
    </div>
  );
};

export default Message;
