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
  const [myUserId, setMyUserId] = useState<string>(sessionStorage.getItem("uuid") || "");
  const [otherUserId,setOtherUserId] = useState<string>("0619-eba4-9bf1-496d-a690-e158-2de9-9871");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ uuid: string, content: string, sentAt: string }>>([]);
  const [roomId, setRoomId] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    socket = io(ENDPOINT);
    // const { uuid, otherUuid, chatId } = location.state || {};

    // function bufferToUuid(bufferData: number[]) {
    //   const hexArray = Array.from(bufferData).map(byte => byte.toString(16).padStart(2, '0'));

    //   return [
    //     hexArray.slice(0, 4).join(''), 
    //     hexArray.slice(4, 6).join(''),    
    //     hexArray.slice(6, 8).join(''),  
    //     hexArray.slice(8, 10).join(''),  
    //     hexArray.slice(10).join('')     
    //   ].join('-');
    // }


    if (!sessionStorage.getItem("uuid") || otherUserId.length === 0) {
      alert("유효한 사용자 ID가 없습니다.");
      navigate(-1);
      return;
    }

    const initiateChat = async () => {
      try {
        const response = await axios.post(ENDPOINT + "/chats/startchat", {
          userUuid: sessionStorage.getItem("uuid"),
          otherUserUuid: otherUserId,
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
        // chatId: parseInt(roomId),
        // userUuid: myUserId,
        // content: message,
        // timeZone: timeZone
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
        <BackButton userName={otherUserId} />
        <div id='title'>채팅</div>
        <Messages messages={messages}/>
        <MessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
