import express from "express";
import { searchDocuments } from "../controller/search/Searches";

const router = express.Router();
router.use(express.json());

router.get("", searchDocuments);

export default router;