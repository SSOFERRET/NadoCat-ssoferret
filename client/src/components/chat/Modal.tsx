import React, { useState } from 'react';
import "./Modal.scss";

interface Props {
  isOpen: boolean;
  onClosed: () => void;
}
const Modal: React.FC<Props> = ({isOpen, onClosed}) => {
  if (!isOpen) return null;
  return (
    <div className='modal'>
      <div className='background' onClick={onClosed}></div>
      <div className='contents'>
        <div className='alarm'>알림</div>
        <div className='question'>채팅방을 나가시겠습니까?</div>
        <div className='buttonbox'>
          <button className='discard' onClick={onClosed}>취소</button>
          <button className='goout'>나가기</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;