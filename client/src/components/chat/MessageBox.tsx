import React from "react";
import MessageSend from "../../assets/img/MessageSend.png";
import "../../styles/scss/components/chat/MessageBox.scss";

interface MessageBoxProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event: React.FormEvent) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, setMessage, sendMessage }) => {

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      sendMessage(event);
      setMessage(''); 
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <form className='messageBox' onSubmit={handleSendMessage}>
      <textarea
        className='inputBox'
        autoComplete='off'
        placeholder="메세지 보내기"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <button className="button" type="submit">
        <img className="sendImg" src={MessageSend} alt="Send" />
      </button>
    </form>
  );
};

export default MessageBox;
