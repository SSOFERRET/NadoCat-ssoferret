import express from "express";
import { getMissingFavorites, postMissingFavorites, deleteMissingFavorites } from "../controller/missing/MissingsFavorites";
import { getMissings } from "../controller/missing/Missings";
import { createMissing, deleteMissing, updateMissing } from "../controller/missing/Missing";
import { createMissingReport, deleteMissingReport } from "../controller/missing/MissingReport";

const router = express.Router();
router.use(express.json());

router.get("", getMissings);
router.post("", createMissing);
router.delete("/:postId", deleteMissing);
router.put("/:postId", updateMissing);

router.post("/:postId/reports", createMissingReport);
router.delete("/:MissingId/reports/:postId", deleteMissingReport);

router.get("/favorites", getMissingFavorites);
router.post("/favorites", postMissingFavorites);
router.delete("/favorites/:postId", deleteMissingFavorites);

export default router;