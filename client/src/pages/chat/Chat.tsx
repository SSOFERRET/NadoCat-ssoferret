import React, { useEffect, useState } from 'react';
import "../../styles/scss/pages/chat/Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
import BackButton from '../../components/common/BackButton';
import io, { Socket } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import Messages from '../../components/chat/Messages';
import axios from 'axios';

const ENDPOINT = "http://localhost:8080";
let socket: Socket;

const Chat = () => {
  const [myUserId, setMyUserId] = useState<string>("");
  const [otherUserId,setOtherUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ user: string, message: string, time: string }>>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    socket = io(ENDPOINT);
    const { myUserId, otherUserId } = location.state || {};
    setMyUserId(myUserId);
    setOtherUserId(otherUserId);
    const initiateChat = async () => {
      try {
        const response = await axios.post("/startchat", {
          userUuid: myUserId,
          otherUserUuid: otherUserId,
        });

        setRoomId(response.data.chatId);

        socket.emit("join", { uuid: myUserId, roomId });

        if (response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error initiating chat:", error);
        alert("Failed to start chat. Please try again.");
      }
    };

    initiateChat();

    socket.on("message", (message: { uuid: string, message: string, time: string }) => {
      const formattedMessage = {
        user: message.uuid, 
        message: message.message,
        time: message.time
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.state]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message) {
      const newMessage = {
        user: myUserId,
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
        <BackButton userName={otherUserId} />
        <Messages messages={messages} user={myUserId}/>
        <MessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
