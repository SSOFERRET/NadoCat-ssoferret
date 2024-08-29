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
exports.deleteLike = exports.addLike = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../../util/errors/errors");
const category_1 = require("../../constants/category");
const client_1 = __importDefault(require("../../client"));
const like_model_1 = require("../../model/like.model");
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const categoryId = Number(req.params.category_id);
        const postId = Number(req.params.post_id);
        const userId = Buffer.from(uuid, "hex");
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const like = yield (0, like_model_1.saveLike)(tx, postId, categoryId, userId);
            if (categoryId === category_1.CATEGORY.COMMUNITIES) {
                yield (0, like_model_1.addCommunityLike)(tx, postId, like.likeId);
            }
            else if (categoryId === category_1.CATEGORY.EVENTS) {
                yield (0, like_model_1.addEventLike)(tx, postId, like.likeId);
            }
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "좋아요가 등록 되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.addLike = addLike;
const deleteLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const categoryId = Number(req.params.category_id);
        const postId = Number(req.params.post_id);
        const userId = Buffer.from(uuid, "hex");
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const like = yield (0, like_model_1.findLike)(tx, postId, categoryId, userId);
            if (!like) {
                return res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (categoryId === category_1.CATEGORY.COMMUNITIES) {
                yield (0, like_model_1.deleteCommunityLike)(tx, postId, like.likeId);
            }
            else if (categoryId === category_1.CATEGORY.EVENTS) {
                yield (0, like_model_1.deleteEventLike)(tx, postId, like.likeId);
            }
            yield (0, like_model_1.removeLike)(tx, like.likeId);
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "좋아요가 삭제 되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.deleteLike = deleteLike;
