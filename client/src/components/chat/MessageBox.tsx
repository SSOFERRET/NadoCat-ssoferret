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
    const trimmedMessage = message.trim(); // 메시지의 양 끝 공백 제거
    if (trimmedMessage) {
      sendMessage(event); // 공백이 제거된 메시지 전송
      setMessage(''); // 메시지 박스를 비움
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
