import "../../styles/scss/pages/chat/ChatList.scss";
import ChatListC from "../../components/chat/ChatList";
import Test from "../../assets/img/test.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/userStore";
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
  const userUuid = sessionStorage.getItem("uuid");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  useEffect(() => {
    if (userUuid && isLoggedIn) {
      const fetchChatList = async () => {
        try {
          const response = await axios.get('http://localhost:8080/chats/chatlist', {
            headers: {
              'X-User-UUID': userUuid,
            },
          });
          setList(response.data);
          console.log(list);
          console.log(sessionStorage.getItem("uuid"))
        } catch (error) {
          console.error('Error fetching chat list:', error);
        }
      };

      fetchChatList();
    }
  }, [userUuid, isLoggedIn]);

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