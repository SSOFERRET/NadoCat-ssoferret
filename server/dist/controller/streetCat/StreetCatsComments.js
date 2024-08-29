"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStreetCatComment = exports.updateStreetCatComment = exports.createStreetCatComment = exports.getStreetCatComments = void 0;
const client_1 = __importDefault(require("../../client"));
const streetCat_model_1 = require("../../model/streetCat.model");
// 동네 고양이 도감 댓글 목록 조회
const getStreetCatComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.street_cat_id);
    const limit = Number(req.query.limit);
    const cursor = Number(req.query.cursor);
    try {
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const getComments = yield (isNaN(cursor)
                ? (0, streetCat_model_1.readComments)(tx, postId, limit)
                : (0, streetCat_model_1.readComments)(tx, postId, limit, cursor));
            res.status(200).json(getComments);
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getStreetCatComments = getStreetCatComments;
// 동네 고양이 도감 댓글 등록
const createStreetCatComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuidString = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // ⬅️ 로그인한 사람만 사용 가능하므로 req.user 정보 사용
    const uuid = Buffer.from(uuidString, "hex");
    const postId = Number(req.params.street_cat_id);
    const { comment } = req.body;
    try {
        const createComment = yield (0, streetCat_model_1.addComment)(uuid, postId, comment);
        if (createComment.streetCatCommentId)
            // await notifyNewComment(uuid, CATEGORY.STREET_CATS, postId, createComment.streetCatCommentId)
            res.status(200).json({ message: "동네 고양이 댓글 등록" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createStreetCatComment = createStreetCatComment;
// 동네 고양이 도감 댓글 수정
const updateStreetCatComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuidString = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // ⬅️ 로그인한 사람만 사용 가능하므로 req.user 정보 사용
    const uuid = Buffer.from(uuidString, "hex");
    const streetCatId = Number(req.params.street_cat_id);
    const streetCatCommentId = Number(req.params.street_cat_comment_id);
    const { comment } = req.body;
    try {
        yield (0, streetCat_model_1.putComment)(uuid, streetCatCommentId, streetCatId, comment);
        res.status(200).json({ message: "동네 고양이 댓글 수정" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateStreetCatComment = updateStreetCatComment;
// 동네 고양이 도감 댓글 삭제
const deleteStreetCatComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuidString = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // ⬅️ 로그인한 사람만 사용 가능하므로 req.user 정보 사용
    const uuid = Buffer.from(uuidString, "hex");
    const streetCatId = Number(req.params.street_cat_id);
    const streetCatCommentId = Number(req.params.street_cat_comment_id);
    try {
        yield (0, streetCat_model_1.removeComment)(uuid, streetCatCommentId, streetCatId);
        res.status(200).json({ message: "동네 고양이 댓글 삭제" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteStreetCatComment = deleteStreetCatComment;
