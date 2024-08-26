import React, { useState } from 'react';
import "../../styles/scss/components/chat/Modal.scss";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClosed: () => void;
  chatId: string|null;
}
const Modal: React.FC<Props> = ({isOpen, onClosed, chatId}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleLeaveChat = () => {
    axios.post('http://localhost:8080/chats/delete', { chatId })
      .then(res => {
        console.log(res);
        alert("채팅방에서 나갔습니다.");
        onClosed();
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
        alert("채팅방 나가기에 실패했습니다.");
        onClosed();
        window.location.reload();
      })
  };
  return (
    <div className='modal'>
      <div className='background' onClick={onClosed}></div>
      <div className='contents'>
        <div className='alarm'>알림</div>
        <div className='question'>채팅방을 나가시겠습니까?</div>
        <div className='buttonbox'>
          <button className='discard' onClick={onClosed}>취소</button>
          <button className='goout' onClick={handleLeaveChat}>나가기</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;