import React, { useEffect, useState } from 'react';
import "../../styles/scss/pages/chat/Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
import BackButton from '../../components/common/BackButton';
import io, { Socket } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import Messages from '../../components/chat/Messages';

const ENDPOINT = "http://localhost:8080";
let socket: Socket;

const Chat = () => {
  const [name, setName] = useState<string>("소연");
  const [room, setRoom] = useState<string>("소영-소연");
  const [users, setUsers] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ user: string, message: string, time: string }>>([]);
  const location = useLocation();

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", { name, room }, (err: string) => {
      if (err) {
        alert(err);
      }
    });

    // 서버로부터 메시지를 받을 때 메시지 상태에 추가
    socket.on("message", (message: { user: string, message: string, time: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [name, room]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message) {
      const newMessage = {
        user: sessionStorage.getItem('user') || name,
        message,
        time: new Date().toLocaleTimeString(),
      };

      // 메시지를 서버로 전송
      socket.emit("sendMessage", newMessage, () => setMessage(''));
      setMessage("");
    }
  }

  return (
    <div className='layout'>
      <div className='Chat'>
        <BackButton userName={name} />
        <Messages messages={messages} />
        <MessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
