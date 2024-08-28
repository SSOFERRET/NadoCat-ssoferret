import express from "express";
import { searchDocuments, searchDocumentsPagination } from "../controller/search/Searches";

const router = express.Router();
router.use(express.json());

router.get("", searchDocuments);
router.get("", searchDocumentsPagination);

export default router;