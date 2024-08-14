import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const BackButton = () => {
  const navigate = useNavigate();  
  return (
    <div style={{width: "360px"}}>
      <IoIosArrowBack 
      style={{color: "black", fontSize: "22px", marginLeft: "20px", marginTop: "20px"}} 
      onClick={() => navigate(-1)}/>
    </div>
  );
};

export default BackButton;
