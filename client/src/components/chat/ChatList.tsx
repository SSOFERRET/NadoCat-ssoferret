import React from 'react';
import "./ChatList.scss";
import "../../styles/css/base/reset.css";
interface IList{
  img: string;
  nickname: string;
  contents: string;
  time: string;
}

interface ChatProps {
  lists: IList[]
}
const ChatList: React.FC<ChatProps> = ({lists}) => {
  return (
    <div className='chatlist'>
      {lists.map((list, index) => (
        <div className='listbox'>
          <div className='imgbox'><img src={list.img} /></div>
          <div className='contentsbox'>
            <div className='nametimebox'>
              <div className='nickname'>{list.nickname}</div>
              <div className='time'>{list.time}</div>
            </div>
            <div className='contents'>{list.contents}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;