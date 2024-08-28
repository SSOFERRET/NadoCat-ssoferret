import "../../styles/scss/pages/chat/ChatList.scss";
import ChatListC from "../../components/chat/ChatList";
import { useState, useEffect } from "react";
import axios from "axios";
import NoList from "../../assets/img/StartChat.png";
import { Buffer } from "buffer";

interface IList{
  users: {
    nickname: string;
    profileImage: string;
  };
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
  unreadCount: number;
}
const ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:8080";

const ChatList = () => {
  const [list, setList] = useState<IList[]>([]);

  useEffect(() => {
    const fetchChatLists = async () => {
      try {
        const response = await axios.get(ENDPOINT + "/chats/chatlist", {
        });
        const chatLists = response.data;

        const updatedLists = await Promise.all(
          chatLists.map(async (list: IList) => {
            console.log(
              "otherUuid :",
              Buffer.from(list.otherUuid.data).toString("hex"),
              sessionStorage.getItem("uuid")
            );
            const otherUuid =
              Buffer.from(list.otherUuid.data).toString("hex") ===
              sessionStorage.getItem("uuid")
                ? list.uuid.data
                : list.otherUuid.data;
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
        console.error("Error fetching chat lists:", error);
      }
    };

    fetchChatLists();
  }, []);

  return (
    <div className="chatList">
      <div className="header">
        <div id="title">채팅</div>
        {list.length ? (
          <ChatListC lists={list} />
        ) : (
          <img src={NoList} className="nolist" />
        )}
      </div>
    </div>
  );
};

export default ChatList;
