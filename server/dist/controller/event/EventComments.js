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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = void 0;
const eventComment_model_1 = require("../../model/eventComment.model");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../../util/errors/errors");
const Notifications_1 = require("../notification/Notifications");
const category_1 = require("../../constants/category");
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.community_id);
        const limit = Number(req.query.limit) || 5;
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const count = yield (0, eventComment_model_1.getCommentCount)(postId);
        const comments = yield (0, eventComment_model_1.getEventComments)(postId, limit, cursor);
        const nextCursor = comments.length === limit ? comments[comments.length - 1].commentId : null;
        const result = {
            comments,
            pagination: {
                nextCursor,
                totalCount: count,
            },
        };
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.getComments = getComments;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const postId = Number(req.params.community_id);
        const comment = req.body.comment;
        if (!comment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
        }
        const newComment = yield (0, eventComment_model_1.addComment)(postId, userId, comment);
        if (newComment.eventCommentId)
            yield (0, Notifications_1.notifyNewComment)(Buffer.from(userId), category_1.CATEGORY.EVENTS, postId, newComment.eventCommentId);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "댓글이 등록되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const postId = Number(req.params.community_id);
        const commentId = Number(req.params.comment_id);
        const comment = req.body.comment;
        const userId = Buffer.from(uuid, "hex");
        if (!comment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
        }
        yield (0, eventComment_model_1.updateCommentById)(postId, userId, commentId, comment);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "댓글이 수정되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const postId = Number(req.params.community_id);
        const commentId = Number(req.params.comment_id);
        const userId = Buffer.from(uuid, "hex");
        yield (0, eventComment_model_1.deleteCommentById)(postId, userId, commentId);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "댓글이 삭제되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.deleteComment = deleteComment;
