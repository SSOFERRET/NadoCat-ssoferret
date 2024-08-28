import React from "react";
import "../../styles/scss/components/chat/Modal.scss";

interface Props {
  isOpen: boolean;
  onClosed: () => void;
  textf?: string;
  textl?: string;
  actionTitle: string;
  onClickAction: () => void;
}
const Modal: React.FC<Props> = ({isOpen, textf, textl, onClosed, actionTitle, onClickAction}) => {
  if (!isOpen) return null;


  return (
    <div className="modal">
      <div className="background" onClick={onClosed}></div>
      <div className="contents">
        <div className="alarm">알림</div>
        <div>
          <div className="question">{textf}</div>
          <div className="question">{textl}</div>
        </div>
        <div className="buttonbox">
          <button className="discard" onClick={onClosed}>
            취소
          </button>
          <button className="goout" onClick={onClickAction}>
            {actionTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
