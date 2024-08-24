import "../../styles/scss/pages/chat/ChatList.scss";
import ChatListC from "../../components/chat/ChatList";
import { useState, useEffect } from "react";
import axios from "axios";
import NoList from "../../assets/img/StartChat.png";

interface IList{
  img: string;
  users: {
    nickname: string;
  }
  messages: {
    content: string;
    sentAt: string;
  }[];
  otherUuid: {
    data: number[];
  };
  uuid: {
    data: number[];
  };
  chatId: string;
}

const ChatList = () => {
  const [list, setList] = useState<IList[]>([]);
  const uuid = localStorage.getItem("uuid");
  const generalToken = localStorage.getItem("generalToken");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    if (uuid) {
      const fetchChatList = async () => {
        try {
          const response = await axios.get('http://localhost:8080/chats/chatlist', {
            headers: {
              Authorization: `Bearer ${generalToken}`,
              "x-user-uuid": uuid,
            },
          });
          setList(response.data);
          console.log(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401 && refreshToken) {
            try {
              const retryResponse = await axios.get('http://localhost:8080/chats/chatlist', {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                  "x-user-uuid": uuid,
                },
              });
              setList(retryResponse.data);
              console.log(retryResponse.data);
            } catch (retryError) {
              console.error('Error fetching chat list after token refresh:', retryError);
            }
          } else {
            console.error('Error fetching chat list:', error);
          }
        }
      };

      fetchChatList();

      const testUuid = async () => {
        try {
          const response = await axios.post("http://localhost:8080/chats", {
            uuid: uuid
          })
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
      testUuid();
    }
  }, [uuid, refreshToken, generalToken]);

  return (
    <div className="chatList">
      <div className="header">
        <div id='title'>채팅</div>
        {
        list.length ? 
        <ChatListC lists={list}/>:
        <img src={NoList} className="nolist"/>
        }
      </div>
      
    </div>
  );
};

export default ChatList;