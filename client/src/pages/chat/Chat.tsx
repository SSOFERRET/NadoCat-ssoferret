import React, { useEffect, useState } from 'react';
import "../../styles/scss/pages/chat/Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
import BackButton from '../../components/common/BackButton';
import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from 'react-router-dom';
import Messages from '../../components/chat/Messages';
import axios from 'axios';

const ENDPOINT = "http://localhost:8080";
let socket: Socket;

const Chat = () => {
  const [myUserId, setMyUserId] = useState<string>(localStorage.getItem("uuid") || "");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ uuid: string, content: string, sentAt: string }>>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [otherUserData, setOtherUserData] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const { userData, otherUuid } = location.state || {}
  
  useEffect(() => {
    socket = io(ENDPOINT);

    if ( !localStorage.getItem("uuid") || !otherUuid ) {
      alert("유효한 사용자 ID가 없습니다.");
      // navigate(-1);
      return;
    }
    const initiateChat = async () => {
      try {
        const response = await axios.post(ENDPOINT + "/chats/startchat", {
          userUuid: localStorage.getItem("uuid"),
          otherUserUuid: userData.uuid || otherUuid
        });
        if(response.data.messages){
          setMessages(response.data.messages);
        }
        setRoomId(response.data.chatId)
        socket.emit("join", { uuid: myUserId, roomId: response.data.chatId });

        socket.on("message", (message: { uuid: string, content: string, sentAt: string }) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      } catch (error) {
        console.error("Error initiating chat:", error);
        alert("Failed to start chat. Please try again.");
      }
    };

    initiateChat();

    return () => {
      socket.disconnect();
      socket.off("message");
    };
  }, [location.state]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const sentAt = new Date().toISOString();
    
    if (message) {
      const newMessage = {
        uuid: myUserId,
        content: message,
        sentAt: sentAt,
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");

      axios.post(ENDPOINT + "/chats/sendmessage", newMessage)
      .then(response => {
        socket.emit("sendMessage", {
          chatId: roomId,
          userUuid: myUserId,
          content: message,
        });
      })
      .catch(error => console.error("Error sending message:", error));
    }
  }

  return (
    <div className='layout'>
      <div className='Chat'>
        <BackButton userName={userData ? userData.nickname : otherUserData} />
        <div id='title'>채팅</div>
        <Messages messages={messages}/>
        <MessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
