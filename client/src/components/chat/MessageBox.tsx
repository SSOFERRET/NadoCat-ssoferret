import { useState } from "react";
import MessageSend from "../../assets/img/MessageSend.png";
import "./MessageBox.scss";
import { FormEvent } from "react";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";

const socket: Socket = io("http://localhost:8080");

const MessageBox = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // 서버로부터 메시지 수신
    socket.on("chat message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue) {
      // 메시지 전송
      socket.emit('chat message', inputValue);
      setInputValue('');  // 입력 값 초기화
    }
  };

  return (
    <form className='messageBox' onSubmit={handleSubmit}>
      <input className='inputBox' autoComplete='off' placeholder="메세지 보내기" onChange={(e) => setInputValue(e.target.value)}/>
      <button className="button">
        <img className="sendImg"src={MessageSend} />
      </button> 
    </form>
  );
};

export default MessageBox;