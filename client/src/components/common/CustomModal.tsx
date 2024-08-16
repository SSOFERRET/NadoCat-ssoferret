import React from 'react'
import "../../styles/scss/components/common/customModal.scss";

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    imageUrl: string;
}

const CustomModal = ({isOpen, onClose, title, message, imageUrl}:CustomModalProps) => {
    if(!isOpen){
        return null;
    }

    return (
    <div className="overlay-back" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={imageUrl} alt="modal" className="img-content" />
            <h2>{title}</h2>
            <p>{message}</p>
            <button onClick={onClose}>확인</button>
        </div>
    </div>
  );
}

export default CustomModal