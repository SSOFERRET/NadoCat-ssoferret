import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface BackButton{
  userName: string;
}
const BackButton:React.FC<BackButton>= ({userName}) => {
  const navigate = useNavigate();  
  return (
    <div style={{width: "95%", height: "7vh", display: "flex", alignItems: "center"}}>
      <IoIosArrowBack 
      style={{color: "black", fontSize: "6.5vh", padding: "2vh 1.4vh 2vh 0"}} 
      onClick={() => navigate(-1)}/>
      <p style={{color:"black", fontSize: "1.9vh", fontWeight:"700"}}>{userName}</p>
    </div>
  );
};

export default BackButton;
