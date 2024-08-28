// import React, { useState } from "react";
// import Chat from "../../pages/chat/Chat";
// import { useNavigate } from "react-router-dom";
// import "../../styles/scss/components/user/userInfo.scss";
// import { IoIosAdd } from "react-icons/io";

// interface ProfileProps {
//   nickname: string;
//   profileImageUrl: string;
// }

// const UserInfo = ({ nickname, profileImageUrl }: ProfileProps) => {
//     const [isOpenModal, setIsOpenModal] = useState(false);
//     const navigate = useNavigate();
//     const StartChat = () => {
//       navigate("/chats/chat", {state: {myUserId: sessionStorage.getItem("uuid"), otherUserId: "0619-eba4-9bf1-496d-a690-e158-2de9-9871"}});
//     }
//     const handleOpenProfileChange = () => {
//         setIsOpenModal(true);
//     };
    
//     const handleCloseProfileChange = () => {
//         setIsOpenModal(false);
//     };

//   return (
//     <div className="info-container">
//       <div className="circle-container">
//         <div className="circle"/>
//         <img src={profileImageUrl} alt="profileImage" className="user-circle" />
//       </div>

//       <div className="nickname-container">
//         <div className="nickname-text">
//           <p>{nickname}</p> 
//           <IoIosAdd />
//         </div>
//         <div className="change-profile-btn">
//           <button onClick={StartChat} >채팅하기</button>
//         </div>
//       </div>

//         {/* {isOpenModal && <ProfileChangeModal closeModal={handleCloseProfileChange} />} */}

//     </div>
//   );
// };

// export default UserInfo;
