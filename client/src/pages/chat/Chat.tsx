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
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ user: string, message: string, time: string }>>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    socket = io(ENDPOINT);
    const { myUserId, otherUserId, myName } = location.state || {};
    const roomId = `${myUserId}-${otherUserId}`;
    setRoomId(roomId);
    setName(myName);

    socket.emit("join", { name: myName, roomId }, (err: string) => {
      if (err) {
        alert(err);
      }
    });

    socket.on("message", (message: { user: string, message: string, time: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [name, roomId]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message) {
      const newMessage = {
        user: name,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("sendMessage", newMessage, () => setMessage(""));
      setMessage("");
    }
  }

  return (
    <div className='layout'>
      <div className='Chat'>
        <BackButton userName={name} />
        <Messages messages={messages} user={name}/>
        <MessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
