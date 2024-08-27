import React, { useEffect, useState } from "react";
import "../../styles/scss/pages/chat/Chat.scss";
import MessageBox from "../../components/chat/MessageBox";
import BackButton from "../../components/common/BackButton";
import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import Messages, { MessageData } from "../../components/chat/Messages";
import axios from "axios";
import { Buffer } from "buffer";

const ENDPOINT = "http://localhost:8080";
let socket: Socket;

const Chat = () => {
  const myUserId = sessionStorage.getItem("uuid") || "";
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageData>>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [otherUserNickname, setOtherUserNickname] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const { userData, realOtherUuid } = location.state || {};

  useEffect(() => {
    socket = io(ENDPOINT);

    if (!sessionStorage.getItem("uuid") || (!realOtherUuid && !userData)) {
      alert("유효한 사용자 ID가 없습니다.");
      // navigate(-1);
      return;
    }

    if (userData && userData.uuid === myUserId) {
      alert("자기 자신에겐 채팅을 할 수 없습니다.");
      navigate(-1);
      return;
    }

    const userUuidForHere = userData
      ? userData.uuid
      : Buffer.from(realOtherUuid).toString("hex");

    const GetUserData = async () => {
      try {
        const response = await axios.post(ENDPOINT + "/chats", {
          uuid: userUuidForHere,
        });
        if (response) {
          setOtherUserNickname(response.data.nickname);
        }
      } catch {}
    };
    const initiateChat = async () => {
      console.log("initiateChat");
      try {
        const response = await axios.post(ENDPOINT + "/chats/startchat", {
          userUuid: sessionStorage.getItem("uuid"),
          otherUserUuid: userUuidForHere,
        });
        if (response.data.messages) {
          setMessages(response.data.messages);
        }
        setRoomId(response.data.chatId);
        socket.emit("join", {
          uuid: sessionStorage.getItem("uuid"),
          roomId: response.data.chatId,
        });

        socket.on(
          "message",
          (message: { uuid: number[]; content: string; sentAt: string }) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        );
      } catch (error) {
        console.error("Error initiating chat:", error);
        alert("Failed to start chat. Please try again.");
      }
    };

    GetUserData();
    initiateChat();

    return () => {
      socket.disconnect();
      socket.off("message");
    };
  }, []);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const sentAt = new Date().toISOString();

    if (message.length !== 0 && message !== " ") {
      const newMessage = {
        uuid: Array.from(Buffer.from(myUserId, "hex")),
        content: message,
        sentAt: sentAt,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");

      axios
        .post(ENDPOINT + "/chats/sendmessage", newMessage)
        .then(
          /*response*/ () => {
            //<= 원래 response => 였는데 컴파일 시 미사용 코드 에러가 나 수정
            socket.emit("sendMessage", {
              chatId: roomId,
              userUuid: myUserId,
              content: message,
            });
          }
        )
        .catch((error) => console.error("Error sending message:", error));
    }
  };

  return (
    <div className="layout">
      <div className="Chat">
        <BackButton userName={otherUserNickname} />
        <div id="title">채팅</div>
        <Messages messages={messages} />
        <MessageBox
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
