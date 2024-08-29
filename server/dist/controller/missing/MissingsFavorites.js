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
exports.deleteMissingFavorites = exports.postMissingFavorites = exports.getMissingFavorites = void 0;
const client_1 = __importDefault(require("../../client"));
const http_status_codes_1 = require("http-status-codes");
/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 *
 */
const getMissingFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favoriteId = yield client_1.default.missingFavorites
            .findMany({
            where: {
                uuid: Buffer.from("test", "hex"),
            },
        })
            .then((favorites) => favorites.map((favorite) => favorite.postId));
        const results = yield client_1.default.missings.findMany({
            where: {
                postId: {
                    in: favoriteId,
                },
            },
            include: {
                boardCategories: true,
                users: true,
                locations: true,
            },
        });
        res.json(results);
    }
    catch (error) {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.getMissingFavorites = getMissingFavorites;
/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 *
 */
const postMissingFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.body.postId);
    try {
        const result = yield client_1.default.missingFavorites.create({
            data: {
                uuid: Buffer.from("test", "hex"),
                postId: postId,
            },
        });
        res.json(result);
    }
    catch (error) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
});
exports.postMissingFavorites = postMissingFavorites;
/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * - [ ] delete 메서드 스타일에 대한 합의
 */
const deleteMissingFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postId);
    try {
        const result = yield client_1.default.missingFavorites.deleteMany({
            where: {
                // missingFavoriteId: undefined,
                uuid: Buffer.from("test", "hex"),
                postId: postId,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
});
exports.deleteMissingFavorites = deleteMissingFavorites;
