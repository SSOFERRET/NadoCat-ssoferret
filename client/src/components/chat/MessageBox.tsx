import MessageSend from "../../assets/img/MessageSend.png";
import "./MessageBox.scss";
const MessageBox = () => {
  return (
    <form className='messageBox'>
      <input className='inputBox' autoComplete='off' placeholder="메세지 보내기"/>
      <button className="button">
        <img className="sendImg"src={MessageSend} />
      </button> 
    </form>
  );
};

export default MessageBox;