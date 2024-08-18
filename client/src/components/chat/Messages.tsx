import React, { useEffect } from 'react';
import BasicScrollToBottom from "react-scroll-to-bottom";
import Message from './Message';
import "./Messages.scss";

interface MessageData {
  user: string;
  message: string;
  time: string;
}

interface Props {
  messages: MessageData[];
}

const Messages: React.FC<Props> = ({ messages}) => {
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <BasicScrollToBottom className="messages">
      {messages.map((message, index) => (
        <div key={index}>
          {message.user === "소영" ? 
          <div className="end"><Message message={message}/></div> :
          <div className="start"><Message message={message}/></div>
          }
        </div>
      ))}
    </BasicScrollToBottom>
  );
};

export default Messages;
