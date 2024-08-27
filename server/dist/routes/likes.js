"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Likes_1 = require("../controller/likes/Likes");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/:category_id/:post_id/likes", auth_1.ensureAutorization, Likes_1.addLike);
router.delete("/:category_id/:post_id/likes", auth_1.ensureAutorization, Likes_1.deleteLike);
exports.default = router;
