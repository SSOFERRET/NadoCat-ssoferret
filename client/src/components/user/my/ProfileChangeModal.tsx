// import React from "react";
import "../../../styles/scss/components/user/my/profileChangeModal.scss";
// import profileCat from "../../../assets/img/profileCat.png";
interface ProfileChangeModalProps {
    closeModal: () => void;
}

const ProfileChangeModal = ({closeModal} : ProfileChangeModalProps) => {

    // const handleUploadClick() => {

    //     //[ ]파일 선택창 열리는 로직
    //     const fileInput = document.createElement("input");
    //     fileInput.type = "file";
    //     fileInput.accept = "image/*";
    //     fileInput.onchange = (event: any) => {
    //         const file = event.target.files[0];

    //         if(file) {
    //             //파일 업로드
    //             //ex) aws s3에 업로드하고 이미지 URL받음
    //             console.log(file);
    //         }
    //     };
    //     fileInput.click();
    // }

    // const handleDefaultImageClick() => {

    //     //[ ]기본 이미지로 변경하는 로직
    //     //ex) DB에 기본 이미지 경로 저장하고 UI 업데이트
    //     const defaultImageUrl = profileCat;
    //     console.log("기본 이미지로 변경: ",defaultImageUrl);
    //     closeModal();
    // }

  return (
      <div className="profile-modal-container">
        <div className="modal-content">
            {/* <button onClick={handleUploadClick}>사진 올리기</button>
            <button onClick={handleDefaultImageClick}>기본 이미지로 변경</button> */}
            <button onClick={closeModal}>취소</button>

        </div>
    </div>
  )
}

export default ProfileChangeModal