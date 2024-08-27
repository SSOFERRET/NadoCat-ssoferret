import express from "express";
const router = express.Router();
router.use(express.json());

import {
  getStreetCats,
  getStreetCat,
  createStreetCat,
  updateStreetCat,
  deleteStreetCat,
} from "../controller/streetCat/StreetCats";

import {
  getStreetCatComments,
  createStreetCatComment,
  updateStreetCatComment,
  deleteStreetCatComment,
} from "../controller/streetCat/StreetCatsComments";
import uploadImages from "../multer";
import { ensureAutorization } from "../middleware/auth";

// 동네 고양이 도감
router.get("/", getStreetCats);
router.get("/:street_cat_id", getStreetCat);
router.post("/", ensureAutorization, uploadImages.array("images"), createStreetCat);
router.put("/:street_cat_id", ensureAutorization, uploadImages.array("images"), updateStreetCat);
router.delete("/:street_cat_id", ensureAutorization, deleteStreetCat);

// 동네 고양이 도감 댓글
router.get("/:street_cat_id/comments", getStreetCatComments);
router.post("/:street_cat_id/comments", ensureAutorization, createStreetCatComment);
router.put("/:street_cat_id/comments/:street_cat_comment_id", ensureAutorization, updateStreetCatComment);
router.delete("/:street_cat_id/comments/:street_cat_comment_id", ensureAutorization, deleteStreetCatComment);

export default router;
