import React from 'react';
import "./Message.scss";

interface MessageData {
  user: string;
  message: string;
  time: string;
}

interface Props {
  message: MessageData; 
}

const Message: React.FC<Props> = ({ message: { user, message, time } }) => {
  const isSentByCurrentUser = user === "소영";

  return isSentByCurrentUser ? (
    <div className="messageWrapper justifyEnd">
      <p className='messageTime justifyEnd'>{time}</p>
      <div className='messageContainer justifyEnd'>
        <p className='messageText justifyEnd'>{message}</p>
      </div>
    </div>
  ) : (
    <div className="messageWrapper justifyStart">
      <div className='messageContainer justifyStart'>
        <p className='messageText justifyStart'>{message}</p>
      </div>
      <p className='messageTime justifyStart'>{time}</p>
    </div>
  );
};

export default Message;
