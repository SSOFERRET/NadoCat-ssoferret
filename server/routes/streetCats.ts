import express from "express";
const router = express.Router();
router.use(express.json());

import {
  getStreetCats,
  getStreetCat,
  createStreetCat,
  updateStreetCat,
  deleteStreetCat,
  getStreetCatMap,
} from "../controller/streetCat/StreetCats";

import {
  getStreetCatComments,
  createStreetCatComment,
  updateStreetCatComment,
  deleteStreetCatComment
} from "../controller/streetCat/StreetCatsComments";
import uploadImages from "../multer";

// 동네 고양이 도감
router.get("/map", getStreetCatMap);
router.get("/", getStreetCats);
router.get("/:street_cat_id", getStreetCat);
router.post("/", uploadImages.array("images"), createStreetCat);
router.put("/:street_cat_id", uploadImages.array("images"), updateStreetCat);
router.delete("/:street_cat_id", deleteStreetCat);

// 동네 고양이 도감 댓글
router.get("/:street_cat_id/comments", getStreetCatComments);
router.post("/:street_cat_id/comments", createStreetCatComment);
router.put("/:street_cat_id/comments/:street_cat_comment_id", updateStreetCatComment);
router.delete("/:street_cat_id/comments/:street_cat_comment_id", deleteStreetCatComment);

export default router;
