import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const BackButton = () => {
  const navigate = useNavigate();  
  return (
    <div style={{width: "80vw"}}>
      <IoIosArrowBack 
      style={{color: "black", fontSize: "22px", marginTop: "2vh"}} 
      onClick={() => navigate(-1)}/>
    </div>
  );
};

export default BackButton;
