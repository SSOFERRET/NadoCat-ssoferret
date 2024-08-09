import express from "express";
import { getMissingFavorites, postMissingFavorites, deleteMissingFavorites } from "../controller/missing/MissingsFavorites";
import { getMissings } from "../controller/missing/Missings";
import { createMissing, deleteMissing } from "../controller/missing/Missing";

const router = express.Router();
router.use(express.json());

router.get("", getMissings);
router.post("", createMissing);
router.delete("/:postId", deleteMissing);
router.get("/favorites", getMissingFavorites);
router.post("/favorites", postMissingFavorites);
router.delete("/favorites/:postId", deleteMissingFavorites);

export default router;