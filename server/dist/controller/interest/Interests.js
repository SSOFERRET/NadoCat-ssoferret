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
exports.getInterests = void 0;
const interest_model_1 = require("../../model/interest.model");
const http_status_codes_1 = require("http-status-codes");
const getInterests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        console.log("userid test:" + userId);
        if (!userId) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ message: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요." });
        }
        const userUuidBuffer = Buffer.from(userId, 'hex');
        console.log(userUuidBuffer);
        const interestPosts = yield (0, interest_model_1.interest)(userUuidBuffer);
        if (!interestPosts.length) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ message: "좋아요한 게시글이 없습니다." });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(interestPosts);
    }
    catch (error) {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버에 에러가 발생했습니다." });
    }
});
exports.getInterests = getInterests;
