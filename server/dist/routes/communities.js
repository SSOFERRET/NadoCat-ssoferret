"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Communities_1 = require("../controller/community/Communities");
const CommunityComments_1 = require("../controller/community/CommunityComments");
const express_validator_1 = require("express-validator");
const validator_1 = require("../middleware/validator");
const multer_1 = __importDefault(require("../multer"));
const auth_1 = require("../middleware/auth");
const validatePostId = [
    (0, express_validator_1.param)("community_id").notEmpty().isInt().withMessage("community_id는 숫자로 입력해주세요."),
    validator_1.validate,
];
const validatePostCreate = [
    (0, express_validator_1.body)("title")
        .isString()
        .withMessage("문자로 입력해 주세요.")
        .notEmpty()
        .withMessage("제목은 필수 항목 입니다.")
        .trim()
        .isLength({ min: 1 })
        .withMessage("제목은 한 글자 이상 입력해야 합니다."),
    (0, express_validator_1.body)("content").optional(),
    (0, express_validator_1.body)("tags").isArray().withMessage("배열로 입력해 주세요."),
    validator_1.validate,
];
const validatePostPut = [
    (0, express_validator_1.body)("title")
        .isString()
        .withMessage("문자로 입력해 주세요.")
        .notEmpty()
        .withMessage("제목은 필수 항목 입니다.")
        .trim()
        .isLength({ min: 1 })
        .withMessage("제목은 한 글자 이상 입력해야 합니다."),
    (0, express_validator_1.body)("content").optional(),
    (0, express_validator_1.body)("newTags").isArray().withMessage("배열로 입력해 주세요."),
    (0, express_validator_1.body)("deleteTagIds").isArray().withMessage("배열로 입력해 주세요."),
    (0, express_validator_1.body)("newImages").isArray().withMessage("배열로 입력해 주세요."),
    (0, express_validator_1.body)("deleteimageIds").isArray().withMessage("배열로 입력해 주세요."),
    validator_1.validate,
];
const validateComment = [
    (0, express_validator_1.body)("comment")
        .isString()
        .withMessage("문자로 입력해 주세요.")
        .notEmpty()
        .withMessage("필수 항목 입니다.")
        .trim()
        .isLength({ min: 1 })
        .withMessage("한 글자 이상 입력해야 합니다."),
    (0, express_validator_1.param)("community_id").notEmpty().isInt().withMessage("community_id는 숫자로 입력해주세요."),
    validator_1.validate,
];
const validateCommentPut = [
    (0, express_validator_1.param)("comment_id").notEmpty().isInt().withMessage("comment_id는 숫자로 입력해주세요."),
    ...validateComment,
];
const validateCommentDelete = [
    (0, express_validator_1.param)("community_id").notEmpty().isInt().withMessage("community_id는 숫자로 입력해주세요."),
    (0, express_validator_1.param)("comment_id").notEmpty().isInt().withMessage("comment_id는 숫자로 입력해주세요."),
    validator_1.validate,
];
const router = express_1.default.Router();
router.get("/", Communities_1.getCommunities);
router.post("/", auth_1.ensureAutorization, multer_1.default.array("images"), Communities_1.createCommunity);
router.get("/:community_id", Communities_1.getCommunity);
router.put("/:community_id", auth_1.ensureAutorization, multer_1.default.array("images"), Communities_1.updateCommunity);
router.delete("/:community_id", auth_1.ensureAutorization, Communities_1.deleteCommunity);
router.get("/:community_id/comments", CommunityComments_1.getComments);
router.post("/:community_id/comments", auth_1.ensureAutorization, CommunityComments_1.createComment);
router.put("/:community_id/comments/:comment_id", auth_1.ensureAutorization, CommunityComments_1.updateComment);
router.delete("/:community_id/comments/:comment_id", auth_1.ensureAutorization, CommunityComments_1.deleteComment);
exports.default = router;
