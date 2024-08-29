import React from "react";
import "../../styles/scss/components/common/commonModal.scss";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClosed: () => void;
}
const Modal: React.FC<Props> = ({isOpen, onClosed}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const goLogin = () => {
    navigate("/users/login")
  }
  return (
    <div className="modal">
      <div className="background" onClick={onClosed}></div>
      <div className="c-contents">
        <div className="alarm">알림</div>
        <div>
          <div className="question">로그인이 필요합니다.</div>
          <div className="question">로그인 하시겠습니까?</div>
        </div>
        <div className="buttonbox">
          <button className="discard" onClick={onClosed}>
            취소
          </button>
          <button className="goout" onClick={goLogin}>
          로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
