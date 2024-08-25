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
const ENDPOINT = "http://localhost:8080";
const ChatList = () => {
  const [list, setList] = useState<IList[]>([]);
  const uuid = localStorage.getItem("uuid");
  // const generalToken = localStorage.getItem("generalToken");
  // const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    
    if (uuid) {
      const fetchChatList = async () => {
        try {
          const response = await axios.get(ENDPOINT + '/chats/chatlist', {
            headers: {
              "x-user-uuid": uuid,
            },
          });
          setList(response.data);
        } catch (error) {
          console.log(error)
        }
      };

      fetchChatList();

      // const testUuid = async () => {
      //   try {
      //     const response = await axios.post("http://localhost:8080/chats", {
      //       uuid: uuid
      //     })
      //     console.log(response);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      // testUuid();
    }
  }, [uuid]);

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