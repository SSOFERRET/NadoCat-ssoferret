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
exports.getPosts = void 0;
const http_status_codes_1 = require("http-status-codes");
const missing_model_1 = require("../../model/missing.model");
const image_model_1 = require("../../model/image.model");
const client_1 = __importDefault(require("../../client"));
const category_1 = require("../../constants/category");
const getPosts = (req, res, postData, missingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, cursor, orderBy, categoryId } = postData;
        const listData = { limit, cursor, orderBy, categoryId };
        const result = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield (0, missing_model_1.getPostsCount)(categoryId);
            let posts = [];
            let userIds = [];
            if (categoryId === category_1.CATEGORY.MISSINGS)
                [posts, userIds] = yield (0, missing_model_1.getPostList)(listData);
            else if (categoryId === category_1.CATEGORY.MISSING_REPORTS)
                [posts, userIds] = yield (0, missing_model_1.getPostList)(listData, missingId);
            userIds.forEach((userId, idx) => {
                posts[idx].users = Object.assign(Object.assign({}, posts[idx].users), { userId });
            });
            const postIds = posts.map((post) => post.postId);
            const imageIds = yield Promise.all(postIds.map((postId) => __awaiter(void 0, void 0, void 0, function* () {
                const eachImageFormats = yield (0, missing_model_1.getImageFormatsByPostId)(tx, { categoryId, postId });
                return eachImageFormats === null || eachImageFormats === void 0 ? void 0 : eachImageFormats.sort((a, b) => a.imageId - b.imageId)[0].imageId;
            })));
            const thumbnails = yield Promise.all(imageIds.map((imageId) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, image_model_1.getImageById)(tx, imageId); })));
            posts = posts.map((post, idx) => {
                return Object.assign(Object.assign({}, post), { images: [thumbnails[idx]] });
            });
            const nextCursor = posts.length === limit ? posts[posts.length - 1].postId : null;
            const result = {
                posts,
                pagination: {
                    nextCursor,
                    totalCount: count,
                },
            };
            return result;
        }));
        res.status(http_status_codes_1.StatusCodes.OK).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.getPosts = getPosts;
