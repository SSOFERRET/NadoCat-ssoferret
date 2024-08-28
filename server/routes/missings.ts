import express from "express";
import { getMissingFavorites, postMissingFavorites, deleteMissingFavorites } from "../controller/missing/MissingsFavorites";
import { createMissing, deleteMissing, getMissing, getMissings, updateFoundState, updateMissing } from "../controller/missing/Missings";
import { createMissingReport, deleteMissingReport, deleteMissingReportHandler, getMissingReport, getMissingReports, updateMissingReport, updateMissingReportCheck } from "../controller/missing/MissingReports";
import uploadImages from "../multer";
import { ensureAutorization } from "../middleware/auth";

const router = express.Router();
router.use(express.json());

router.get("", getMissings);
router.get("/:postId", getMissing);
router.post("", ensureAutorization, uploadImages.array("images"), createMissing);
router.delete("/:postId", ensureAutorization, deleteMissing);
router.put("/:postId", ensureAutorization, uploadImages.array("images"), updateMissing);
router.patch("/:postId", ensureAutorization, updateFoundState);

router.get("/:missingId/reports/:postId", getMissingReport);
router.post("/:postId/reports", ensureAutorization, uploadImages.array("images"), createMissingReport);
router.get("/:missingId/reports", ensureAutorization, getMissingReports);
router.delete("/:missingId/reports/:postId", ensureAutorization, deleteMissingReportHandler);
router.put("/:missingId/reports/:postId", ensureAutorization, uploadImages.array("images"), updateMissingReport);
router.patch("/:missingId/reports/:postId", ensureAutorization, updateMissingReportCheck);

router.get("/favorites", getMissingFavorites);
router.post("/favorites", postMissingFavorites);
router.delete("/favorites/:postId", deleteMissingFavorites);

export default router;