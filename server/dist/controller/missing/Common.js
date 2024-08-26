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
exports.getPosts = void 0;
const http_status_codes_1 = require("http-status-codes");
const missing_model_1 = require("../../model/missing.model");
const getPosts = (req, res, postData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, cursor, orderBy, categoryId } = postData;
        const listData = { limit, cursor, orderBy, categoryId };
        const count = yield (0, missing_model_1.getPostsCount)(categoryId);
        let posts = yield (0, missing_model_1.getPostList)(listData);
        const nextCursor = posts.length === limit ? posts[posts.length - 1].postId : null;
        const result = {
            posts,
            pagination: {
                nextCursor,
                totalCount: count
            }
        };
        res.status(http_status_codes_1.StatusCodes.OK).send(result);
    }
    catch (error) {
        console.error(error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
});
exports.getPosts = getPosts;
