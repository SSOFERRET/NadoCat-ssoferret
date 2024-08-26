"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.use(express_1.default.json());
const StreetCats_1 = require("../controller/streetCat/StreetCats");
const StreetCatsComments_1 = require("../controller/streetCat/StreetCatsComments");
const multer_1 = __importDefault(require("../multer"));
// 동네 고양이 도감
router.get("/", StreetCats_1.getStreetCats);
router.get("/:street_cat_id", StreetCats_1.getStreetCat);
router.post("/", multer_1.default.array("images"), StreetCats_1.createStreetCat);
router.put("/:street_cat_id", multer_1.default.array("images"), StreetCats_1.updateStreetCat);
router.delete("/:street_cat_id", StreetCats_1.deleteStreetCat);
// 동네 고양이 도감 댓글
router.get("/:street_cat_id/comments", StreetCatsComments_1.getStreetCatComments);
router.post("/:street_cat_id/comments", StreetCatsComments_1.createStreetCatComment);
router.put("/:street_cat_id/comments/:street_cat_comment_id", StreetCatsComments_1.updateStreetCatComment);
router.delete("/:street_cat_id/comments/:street_cat_comment_id", StreetCatsComments_1.deleteStreetCatComment);
exports.default = router;
