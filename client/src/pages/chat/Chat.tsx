import React, { useEffect, useState } from 'react';
import "../../styles/scss/pages/chat/Chat.scss";
import MessageBox from '../../components/chat/MessageBox';
import BackButton from '../../components/common/BackButton';
import io, { Socket } from "socket.io-client";
import { Location, useLocation } from 'react-router-dom';
import Messages from '../../components/chat/Messages';

const ENDPOINT = "http://localhost:8080";
let socket:Socket;

const Chat = () => {
  const [name, setName] = useState<string>("김지우");
  const [room, setRoom] = useState<string>("방입니다");
  const [users, setUsers] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  // const [messages, setMessages] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    setName(location.state?.User);
    setRoom(location.state?.Room);
    console.log(room)
    socket = io(ENDPOINT);

    socket.emit("join", { name, room }, (err: string) => {
      if (err) {
        alert(err);
      }
      console.log("emit join");
    });

    // socket.on("message", (message: string) => {
    //   setMessages((prevMessages) => [...prevMessages, message]);
    //   console.log("on message");
    // });

    socket.on("roomData", ({ users }: { users: string }) => {
      setUsers(users);
      console.log("on roomData");
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT, name, room]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
      setMessage("");
      console.log(messages)
    }
  }

  const [messages, setMessages] = useState([
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:00 AM' },
    { user: 'Jane', text: 'Hi there!', time: '10:01 AM' },
    { user: 'John', text: 'How are you?', time: '10:02 AM' },
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:00 AM' },
    { user: 'Jane', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:01 AM' },
    { user: 'John', text: 'How are you?', time: '10:02 AM' },
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:00 AM' },
    { user: 'Jane', text: 'Hi there!', time: '10:01 AM' },
    { user: 'John', text: 'How are you?', time: '10:02 AM' },
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:00 AM' },
    { user: 'Jane', text: 'Hi there!', time: '10:01 AM' },
    { user: 'John', text: 'How are you?', time: '10:02 AM' },
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:00 AM' },
    { user: 'Jane', text: 'Hi there!', time: '10:01 AM' },
    { user: 'John', text: 'How are you?', time: '10:02 AM' },
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:00 AM' },
    { user: 'Jane', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring. hello my name is munsoyeong', time: '10:01 AM' },
    { user: 'John', text: 'Hello! my name is musoyeong i dont want to do coding because im so boring', time: '10:02 AM' },

  ]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      user: sessionStorage.getItem('user') || 'John',
      text,
      time: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
  };
  return (
    <div className='layout'>
      <div className='Chat'>
        <BackButton userName={name}/>
          {/* <div className='chatlist'>
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg.text}
              </div>
            ))}
          </div> */}
          <Messages messages={messages}/>
        <MessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
    
  );
};

export default Chat;