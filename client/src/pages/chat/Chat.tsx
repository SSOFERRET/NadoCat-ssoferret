import React, { useEffect, useState } from 'react';
import "../../styles/scss/pages/chat/Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
import BackButton from '../../components/common/BackButton';
const Chat = () => {
  
  return (
    <div className='layout'>
      <div className='Chat'>
        <BackButton userName='문소영'/>

        <MessageBox />
      </div>
    </div>
    
  );
};

export default Chat;