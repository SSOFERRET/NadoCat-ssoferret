import React, { useEffect } from 'react';
import BasicScrollToBottom from "react-scroll-to-bottom";
import Message from './Message';
import "../../styles/scss/components/chat/Messages.scss";

interface MessageData {
  // chatId: number; 
  // userUuid: string;
  // content: string;
  // timeZone: string;
  uuid: string;
  content: string;
  sentAt: string;
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
          {sessionStorage.getItem("uuid") === "0619-eba4-9bf1-496d-a690-e158-2de9-9871"? 
          <div className="end"><Message message={message} /></div> :
          <div className="start"><Message message={message}/></div>
          }
        </div>
      ))}
    </BasicScrollToBottom>
  );
};

export default Messages;