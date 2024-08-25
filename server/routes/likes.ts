import express from "express";
import { addLike, deleteLike } from "../controller/likes/Likes";
import { ensureAutorization } from "../middleware/auth";

const router = express.Router();

router.post("/:category_id/:post_id/likes", ensureAutorization, addLike);

router.delete("/:category_id/:post_id/likes", ensureAutorization, deleteLike);

export default router;
