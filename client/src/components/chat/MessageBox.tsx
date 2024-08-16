import React from "react";
import MessageSend from "../../assets/img/MessageSend.png";
import "./MessageBox.scss";

interface MessageBoxProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event: React.FormEvent) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, setMessage, sendMessage }) => {
  return (
    <form className='messageBox' onSubmit={sendMessage}>
      <input
        className='inputBox'
        autoComplete='off'
        placeholder="메세지 보내기"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="button" type="submit">
        <img className="sendImg" src={MessageSend} alt="Send" />
      </button>
    </form>
  );
};

export default MessageBox;
