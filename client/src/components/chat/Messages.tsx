import React, { useEffect } from 'react';
import BasicScrollToBottom from "react-scroll-to-bottom";
import Message from './Message';
import "../../styles/scss/components/chat/Messages.scss";
import { Buffer } from 'buffer';
import { useAuthStore } from '../../store/userStore';
export interface MessageData {
  uuid: number[],
  content: string;
  sentAt: string;
}

interface Props {
  messages: MessageData[];
}

const Messages: React.FC<Props> = ({ messages}) => {
  const { uuid } = useAuthStore(); 
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <BasicScrollToBottom className="messages">
      {messages.map((message, index) => (
        <div key={index}>
          { Buffer.from(message.uuid).toString("hex") === uuid ? 
          <div className="end"><Message message={message} /></div> :
          <div className="start"><Message message={message}/></div>
          }
        </div>
      ))}
    </BasicScrollToBottom>
  );
};

export default Messages;
