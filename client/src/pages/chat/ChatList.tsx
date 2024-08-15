import "../../styles/scss/pages/chat/ChatList.scss";
import BackButton from "../../components/common/BackButton";
import ChatListC from "../../components/chat/ChatList";
import Test from "../../assets/img/test.png";
interface IList{
  img: string;
  nickname: string;
  contents: string;
  time: string;
}
const List: IList[] = [
  {
    img: Test,
    nickname: "상대방 닉네임",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "안녕하세유",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임인데 뭐라고 짓지 룰루랄",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "안녕하세유",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임인데 뭐라고 짓지 룰루랄",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임인데 뭐라고 짓지 룰루랄",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  },
  {
    img: "",
    nickname: "상대방 닉네임",
    contents: "채팅 내용 미리보기 채팅 내용 미리보기 채팅 내용 미리보기 채팅 미리보기 보기보기",
    time: "1분 전"
  }
]
const ChatList = () => {
  return (
    <div className="chatList">
      <div className="header">
        <div id='title'>채팅</div>
        <ChatListC lists={List}/>
      </div>
      
    </div>
  );
};

export default ChatList;