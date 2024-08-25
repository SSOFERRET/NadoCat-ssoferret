// import React from "react";
import "../../../styles/scss/components/user/my/profileChangeModal.scss";

interface ProfileChangeModalProps {
    isShowMenu: boolean;
    closeModal: () => void;
    uploadImage: (file: File) => void;
    setDefaultImage: () => void;
}

const ProfileChangeModal = ({isShowMenu, closeModal, uploadImage, setDefaultImage} : ProfileChangeModalProps) => {
    
    const handleProfileMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.target === e.currentTarget) {
            closeModal(); 
        }
    };
    
    //[ ]파일 선택창 열리는 로직
    const handleUploadClick = () => {
        const fileInput = document.createElement("input");

        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            
            if(target && target.files && target.files.length > 0) {
                const file = target.files[0];
                //파일 업로드
                //ex) aws s3에 업로드하고 이미지 URL받음
                uploadImage(file); 
                closeModal();
            }
        };
        fileInput.click(); 
    }

    //[ ]기본 이미지로 변경하는 로직
    const handleDefaultImageClick = () => {
        //ex) DB에 기본 이미지 경로 저장하고 UI 업데이트
        setDefaultImage();
        closeModal();
    }


  return (
    <div className="profile-modal-container" onClick={handleProfileMenu}>
        <ul className={`profile-contents ${isShowMenu? "show" : "hide"}`}>
                <li onClick={handleUploadClick}>사진 올리기</li>
                <li onClick={handleDefaultImageClick}>기본 이미지로 변경</li>
        </ul>
    </div>
  )
}

export default ProfileChangeModal