import React from 'react';
import "./Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
import BackButton from '../../components/common/BackButton';
const Chat = () => {
  return (
    <div className='Chat'>
      <BackButton userName='문소영fkfkf'/>
      
      <MessageBox />
    </div>
  );
};

export default Chat;