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
exports.deleteFavoriteCat = exports.addFavoriteCat = exports.getFavoriteCat = exports.getFavoriteCats = void 0;
const client_1 = __importDefault(require("../../client"));
const streetCat_model_1 = require("../../model/streetCat.model");
// CHECKLIST
// [ ] response 정돈
// [ ] 에러 처리
// NOTE 먄약 이 페이지가 로그인한 사용자만 이용 가능한 페이지라면 ensureAutorization 미들웨어와 함께 req.user.uuid를 사용
// 동네 고양이 도감 즐겨찾기(내 도감) 목록 조회
const getFavoriteCats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidString = req.headers["x-uuid"];
    const uuid = uuidString && Buffer.from(uuidString, "hex"); // ⬅️ 이렇게 수정
    const limit = Number(req.query.limit);
    const cursor = Number(req.query.cursor);
    try {
        if (!uuid) {
            // throw new Error("User UUID is missing.");
            res.status(200).json({ message: "로그인 안 한 유저" });
        }
        else {
            yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const getFavoritePostIds = yield (0, streetCat_model_1.readFavoriteCatPostIds)(tx, uuid);
                const postIds = getFavoritePostIds.map((post) => {
                    return post.postId;
                });
                const getFavoriteCatPosts = yield (isNaN(cursor)
                    ? (0, streetCat_model_1.readFavoriteCatPosts)(tx, uuid, limit, cursor, postIds)
                    : (0, streetCat_model_1.readFavoriteCatPosts)(tx, uuid, limit, cursor, postIds));
                getFavoriteCatPosts.favoriteCatPostCount;
                const result = {
                    favoriteCatPosts: getFavoriteCatPosts.favoriteCatPosts,
                    nickname: (_a = getFavoriteCatPosts.nickname) === null || _a === void 0 ? void 0 : _a.nickname,
                    myCatCount: getFavoriteCatPosts.favoriteCatPostCount,
                };
                res.status(200).json(result);
            }));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFavoriteCats = getFavoriteCats;
// 동네 고양이 도감 즐겨찾기(내 도감) 조회
const getFavoriteCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    // const uuid = Buffer.from(uuidString.replace(/-/g, ""), "hex");
    const uuid = uuidString && Buffer.from(uuidString, "hex"); // ⬅️ 이렇게 수정
    const postId = Number(req.params.street_cat_id);
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const getFavoriteCat = yield (0, streetCat_model_1.readFavoriteCat)(uuid, postId);
        res.status(200).json(getFavoriteCat);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFavoriteCat = getFavoriteCat;
// 동네 고양이 도감 즐겨찾기(내 도감) 추가
const addFavoriteCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    // const uuid = Buffer.from(uuidString.replace(/-/g, ""), "hex");
    const uuid = uuidString && Buffer.from(uuidString, "hex"); // ⬅️ 이렇게 수정
    const postId = Number(req.params.street_cat_id);
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        yield (0, streetCat_model_1.createFavoriteCat)(uuid, postId);
        res.status(200).json({ message: "내 도감 추가" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.addFavoriteCat = addFavoriteCat;
// 동네 고양이 도감 즐겨찾기(내 도감) 삭제
const deleteFavoriteCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidString = req.headers["x-uuid"];
    const postId = Number(req.params.street_cat_id);
    try {
        const uuid = uuidString && Buffer.from(uuidString.replace(/-/g, ""), "hex");
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        yield (0, streetCat_model_1.removeFavoriteCat)(uuid, postId);
        res.status(200).json({ message: "내 도감 삭제" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteFavoriteCat = deleteFavoriteCat;
