import React from 'react';
import "./Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
const Chat = () => {
  return (
    <div className='Chat'>
      <MessageBox />
    </div>
  );
};

export default Chat;