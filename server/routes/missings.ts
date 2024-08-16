import express from "express";
import { getMissingFavorites, postMissingFavorites, deleteMissingFavorites } from "../controller/missing/MissingsFavorites";
// import { createMissing, deleteMissing, getMissing, getMissings, updateFoundState, updateMissing } from "../controller/missing/Missings";
import { createMissingReport, deleteMissingReport, deleteMissingReportHandler, getMissingReport, getMissingReports, updateMissingReport, updateMissingReportCheck } from "../controller/missing/MissingReports";

const router = express.Router();
router.use(express.json());

// router.get("", getMissings);
// router.get("/:postId", getMissing);
// router.post("", createMissing);
// router.delete("/:postId", deleteMissing);
// router.put("/:postId", updateMissing);
// router.patch("/:postId", updateFoundState);

router.get("/:missingId/reports/:postId", getMissingReport);
router.post("/:postId/reports", createMissingReport);
router.get("/:missingId/reports", getMissingReports);
router.delete("/:missingId/reports/:postId", deleteMissingReportHandler);
router.put("/:missingId/reports/:postId", updateMissingReport);
router.patch("/:missingId/reports/:postId", updateMissingReportCheck);

router.get("/favorites", getMissingFavorites);
router.post("/favorites", postMissingFavorites);
router.delete("/favorites/:postId", deleteMissingFavorites);

export default router;