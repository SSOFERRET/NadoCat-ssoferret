import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

//req에 이미지 정보 입력해주는 미들웨어 
const storage = multer.memoryStorage();
const uploadImages = multer({ storage });

export default uploadImages;