import express from "express";
import {
  getCommunities,
  getCommunity,
  createCommunity,
  deleteCommunity,
  updateCommunity,
} from "../controller/community/Communities";
import { createComment, deleteComment, getComments, updateComment } from "../controller/community/CommunityComments";
import { body, param } from "express-validator";
import { validate } from "../middleware/validator";
import uploadImages from "../multer";
import { ensureAutorization } from "../middleware/auth";

const validatePostId = [
  param("community_id").notEmpty().isInt().withMessage("community_id는 숫자로 입력해주세요."),
  validate,
];

const validatePostCreate = [
  body("title")
    .isString()
    .withMessage("문자로 입력해 주세요.")
    .notEmpty()
    .withMessage("제목은 필수 항목 입니다.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("제목은 한 글자 이상 입력해야 합니다."),
  body("content").optional(),
  body("tags").isArray().withMessage("배열로 입력해 주세요."),
  validate,
];

const validatePostPut = [
  body("title")
    .isString()
    .withMessage("문자로 입력해 주세요.")
    .notEmpty()
    .withMessage("제목은 필수 항목 입니다.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("제목은 한 글자 이상 입력해야 합니다."),
  body("content").optional(),
  body("newTags").isArray().withMessage("배열로 입력해 주세요."),
  body("deleteTagIds").isArray().withMessage("배열로 입력해 주세요."),
  body("newImages").isArray().withMessage("배열로 입력해 주세요."),
  body("deleteimageIds").isArray().withMessage("배열로 입력해 주세요."),
  validate,
];

const validateComment = [
  body("comment")
    .isString()
    .withMessage("문자로 입력해 주세요.")
    .notEmpty()
    .withMessage("필수 항목 입니다.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("한 글자 이상 입력해야 합니다."),
  param("community_id").notEmpty().isInt().withMessage("community_id는 숫자로 입력해주세요."),
  validate,
];

const validateCommentPut = [
  param("comment_id").notEmpty().isInt().withMessage("comment_id는 숫자로 입력해주세요."),
  ...validateComment,
];

const validateCommentDelete = [
  param("community_id").notEmpty().isInt().withMessage("community_id는 숫자로 입력해주세요."),
  param("comment_id").notEmpty().isInt().withMessage("comment_id는 숫자로 입력해주세요."),
  validate,
];

const router = express.Router();

router.get("/", getCommunities);

router.post("/", ensureAutorization, uploadImages.array("images"), createCommunity);

router.get("/:community_id", getCommunity);

router.put("/:community_id", ensureAutorization, uploadImages.array("images"), updateCommunity);

router.delete("/:community_id", ensureAutorization, deleteCommunity);

router.get("/:community_id/comments", getComments);

router.post("/:community_id/comments", ensureAutorization, createComment);

router.put("/:community_id/comments/:comment_id", ensureAutorization, updateComment);

router.delete("/:community_id/comments/:comment_id", ensureAutorization, deleteComment);

export default router;
