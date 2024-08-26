// import React from "react";
import "../../styles/scss/components/user/customModal.scss";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string[];
  imageUrl: string;
}

const CustomModal = ({
  isOpen,
  onClose,
  title,
  message,
  imageUrl,
}: CustomModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay-back" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="circle-container">
          <div className="circle"></div>
          <img src={imageUrl} alt="modal" className="img-content" />
        </div>

        <h2>{title}</h2>
        <p>
          {message.map((line, index) => (
            <span key={index}>
              {line}
              {index < message.length - 1 && <br />}
            </span>
          ))}
        </p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default CustomModal;
