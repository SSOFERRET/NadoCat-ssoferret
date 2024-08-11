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
  deleteStreetCatComment
} from "../controller/streetCat/StreetCatsComments";

// 동네 고양이 도감
router.get("/", getStreetCats);
router.get("/:street_cat_id", getStreetCat);
router.post("/", createStreetCat);
router.put("/:street_cat_id", updateStreetCat);
router.delete("/:street_cat_id", deleteStreetCat);

// 동네 고양이 도감 댓글
router.get("/:street_cat_id/comments", getStreetCatComments);
router.post("/:street_cat_id/comments", createStreetCatComment);
router.put("/:street_cat_id/comments", updateStreetCatComment);
router.delete("/:street_cat_id/comments", deleteStreetCatComment);

export default router;
