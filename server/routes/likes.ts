import express from "express";
import { addLike, deleteLike } from "../controller/likes/Likes";

const router = express.Router();

router.post("/:category_id/:post_id/likes", addLike);

router.delete("/:category_id/:post_id/likes", deleteLike);

export default router;
