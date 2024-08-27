// import React from "react";
import "../../styles/scss/components/user/customModal.scss";

interface CustomModalProps {
  isOpen?: boolean;
  title?: string;
  message?: string[];
  imageUrl?: string;
  buttons?: {
    label: string;
    onClick: () => void;
  }[]; //버튼 동적관리
  size: "sm" | "lg";
}

const CustomModal = ({
  isOpen,
  title,
  message,
  imageUrl,
  buttons,
  size,
}: CustomModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay-back" onClick={(e) => e.stopPropagation()}>
      <div
        className={`modal-content ${size === "sm" ? "sm-modal" : "lg-modal"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {size === "lg" && imageUrl && (
          <div className="circle-container">
            <div className="circle"></div>
            <img src={imageUrl} alt="modal" className="img-content" />
          </div>
        )}

        {title && <h2>{title}</h2>}
        {message && 
          <p>
          {message.map((line, index) => (
            <span key={index}>
              {line}
              {index < message.length - 1 && <br />}
            </span>
          ))}
        </p>
        }

        <div className="modal-buttons">
          {buttons && buttons.length > 0 ? (
            buttons.map((button, index) => (
              <button key={index} onClick={button.onClick}>
                {button.label}
              </button>
            ))
          ) : (
            <button onClick={() => {}}>확인</button> //버튼이 없을때 자동제공
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
