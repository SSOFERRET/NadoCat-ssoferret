import React from 'react';
import "./Message.scss";

interface MessageData {
  user: string;
  text: string;
  time: string;
}

interface Props {
  message: MessageData; 
}

const Message: React.FC<Props> = ({ message: { user, text, time } }) => {
  const isSentByCurrentUser = user === "John";

  return isSentByCurrentUser ? (
    <div className="messageWrapper justifyEnd">
      <p className='messageTime justifyEnd'>{time}</p>
      <div className='messageContainer justifyEnd'>
        <p className='messageText justifyEnd'>{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageWrapper justifyStart">
      <div className='messageContainer justifyStart'>
        <p className='messageText justifyStart'>{text}</p>
      </div>
      <p className='messageTime justifyStart'>{time}</p>
    </div>
  );
};

export default Message;
