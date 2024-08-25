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
    const fetchChatLists = async () => {
      try {
        const response = await axios.get(ENDPOINT + '/chats/chatlist', {
          headers: {
            "x-user-uuid": uuid,
          },
        });
        const chatLists = response.data;

        const updatedLists = await Promise.all(
          chatLists.map(async (list: IList) => {
            const otherUuid = list.otherUuid.data;
            const userResponse = await axios.post(`${ENDPOINT}/chats`, {
              uuid: otherUuid,
            });
            const nickname = userResponse.data.nickname;
            return {
              ...list,
              users: {
                ...list.users,
                nickname: nickname,
              },
            };
          })
        );

        setList(updatedLists);
      } catch (error) {
        console.error('Error fetching chat lists:', error);
      }
    };

    fetchChatLists();
  }, []);

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