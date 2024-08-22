import express from "express";
import uploadImages from "../multer";
import { deleteS3Test, getS3Test, updateS3Test } from "../controller/s3HandleTest";
const router = express.Router();
router.use(express.json());

router.post('', uploadImages.array("images"), updateS3Test);
router.delete('', deleteS3Test);
router.get('', getS3Test);

export default router;
