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
exports.deleteStreetCat = exports.updateStreetCat = exports.createStreetCat = exports.getStreetCat = exports.getStreetCats = exports.getUuid = void 0;
const client_1 = __importDefault(require("../../client"));
const streetCat_model_1 = require("../../model/streetCat.model");
const client_2 = require("@prisma/client");
const category_1 = require("../../constants/category");
const Searches_1 = require("../search/Searches");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
const addNewImages_1 = require("../../util/images/addNewImages");
// CHECKLIST
// [x] 페이지네이션 구현
// [x] 썸네일 어떻게 받아올지
// [ ] 에러 처리
// NOTE uuid 받아오는 임시함수 / 추후 삭제
const getUuid = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.$queryRaw(client_2.Prisma.sql `SELECT uuid FROM users WHERE id = 1`);
    return result[0]['uuid'];
});
exports.getUuid = getUuid;
const categoryId = category_1.CATEGORY.STREET_CATS;
// 동네 고양이 도감 목록 조회
const getStreetCats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');
    console.log("uuidString: ", uuidString);
    console.log("uuid: ", uuid);
    const limit = Number(req.query.limit);
    const cursor = Number(req.query.cursor);
    try {
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            if (uuid) {
                // 도감 목록 좋아요 유무
                const getPostsWithFavorites = yield (isNaN(cursor)
                    ? (0, streetCat_model_1.readPostsWithFavorites)(tx, uuid, limit)
                    : (0, streetCat_model_1.readPostsWithFavorites)(tx, uuid, limit, cursor));
                res.status(201).json(getPostsWithFavorites);
            }
            else {
                const getPosts = yield (isNaN(cursor)
                    ? (0, streetCat_model_1.readPosts)(tx, limit)
                    : (0, streetCat_model_1.readPosts)(tx, limit, cursor));
                res.status(201).json(getPosts);
            }
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getStreetCats = getStreetCats;
// 동네 고양이 도감 상세 조회
const getStreetCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');
    console.log("uuidString: ", uuidString);
    console.log("uuid: ", uuid);
    const postId = Number(req.params.street_cat_id);
    try {
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const getPost = yield (0, streetCat_model_1.readPost)(postId);
            const locationId = Number(getPost === null || getPost === void 0 ? void 0 : getPost.locationId);
            const getLocation = yield (0, streetCat_model_1.readLocation)(tx, locationId);
            const postData = Object.assign(Object.assign({}, getPost), { location: getLocation });
            // if (!getPost) throw new Error("No Post"); // 타입 가드 필요해서 추가
            // redis 서버 연결 필요하여 주석 처리함. 
            // 공동의 서버에는 나중에 설치할 예정
            // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.STREET_CATS, postId);
            // getPost.views += viewIncrementResult || 0;
            res.status(200).json(postData);
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getStreetCat = getStreetCat;
// 동네 고양이 도감 생성
const createStreetCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');
    console.log("uuidString: ", uuidString);
    console.log("uuid: ", uuid);
    const { name, gender, neutered, discoveryDate, content } = req.body;
    const location = JSON.parse(req.body.location);
    const postData = { categoryId, name, gender, neutered, discoveryDate, content, uuid };
    try {
        const post = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // location 생성
            const newLocation = yield (0, streetCat_model_1.createLoction)(tx, location);
            const locationId = newLocation.locationId;
            // 도감 게시글 생성
            const newPost = yield (0, streetCat_model_1.createPost)(tx, postData, locationId);
            const postId = newPost.postId;
            // 도감 이미지 생성
            if (req.files) {
                // - uploadImagesToS3 사용해서 생성하고
                const images = yield (0, s3ImageHandler_1.uploadImagesToS3)(req);
                // - addNewImages 사용해서 생성
                const newImages = yield (0, addNewImages_1.addNewImages)(tx, {
                    userId: uuid,
                    postId,
                    categoryId: categoryId,
                }, images || []);
                // 생성한 image_id, post_id 받기
                const getStreetCatImages = newImages.map((imageId) => ({
                    imageId,
                    postId
                }));
                // street_cat_images 데이터 생성
                yield (0, streetCat_model_1.createStreetCatImages)(tx, getStreetCatImages);
            }
            // await notifyNewPostToFriends(uuid, CATEGORY.STREET_CATS, postId);
            // await indexOpensearchDocument(CATEGORY.STREET_CATS, name, content, postId);
            return newPost;
        }));
        res.status(201).json({ message: "동네 고양이 도감 생성" });
        yield (0, Searches_1.indexResultToOpensearch)(category_1.CATEGORY.STREET_CATS, post.postId);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createStreetCat = createStreetCat;
// 동네 고양이 도감 수정
const updateStreetCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');
    console.log("uuidString: ", uuidString);
    console.log("uuid: ", uuid);
    const { name, gender, neutered, discoveryDate, locationId, content, deleteImageIds } = req.body;
    const postId = Number(req.params.street_cat_id);
    const postData = { postId, categoryId, name, gender, neutered, discoveryDate, locationId, content, uuid };
    const imageIds = JSON.parse(deleteImageIds);
    try {
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 도감 게시글 수정
            const editPost = yield (0, streetCat_model_1.updatePost)(tx, postData);
            // 도감 이미지 생성
            if (req.files) {
                // - uploadImagesToS3 사용해서 생성하고
                const images = yield (0, s3ImageHandler_1.uploadImagesToS3)(req);
                // - addNewImages 사용해서 생성
                const newImages = yield (0, addNewImages_1.addNewImages)(tx, {
                    userId: uuid,
                    postId,
                    categoryId: categoryId,
                }, images || []);
                const getStreetCatImages = newImages.map((imageId) => ({
                    imageId,
                    postId,
                }));
                yield (0, streetCat_model_1.createStreetCatImages)(tx, getStreetCatImages);
            }
            // 게시글에서 지운 이미지 삭제
            if (imageIds.length) {
                yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
                yield (0, streetCat_model_1.deleteStreetCatImages)(tx, imageIds);
                yield (0, streetCat_model_1.deleteImages)(tx, imageIds);
            }
            yield (0, Searches_1.updateOpensearchDocument)(categoryId, postId, { content });
            res.status(201).json({ message: "동네 고양이 도감 수정" });
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateStreetCat = updateStreetCat;
// 동네 고양이 도감 삭제
const deleteStreetCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 로그인한 유저와 게시글 작성 유저가 같은지 판별 필요
    // const uuid = await getUuid();
    const uuidString = req.headers["x-uuid"];
    const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');
    console.log("uuidString: ", uuidString);
    console.log("uuid: ", uuid);
    const postId = Number(req.params.street_cat_id);
    try {
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const getStreetCatImages = yield (0, streetCat_model_1.readStreetCatImages)(postId);
            const imageIds = getStreetCatImages.map(image => image.imageId);
            console.log("imageIds", imageIds);
            yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
            yield (0, streetCat_model_1.deleteAllStreetCatImages)(tx, postId);
            yield (0, streetCat_model_1.deleteThumbnail)(tx, postId);
            yield (0, streetCat_model_1.deleteImages)(tx, imageIds);
            yield (0, streetCat_model_1.removeAllFavoriteCat)(postId);
            yield (0, streetCat_model_1.removeAllComment)(postId);
            yield (0, streetCat_model_1.deletePost)(tx, postId, uuid);
            yield (0, Searches_1.deleteOpensearchDocument)(category_1.CATEGORY.STREET_CATS, postId);
            // status 204는 message가 보내지지 않아 임시로 200
            res.status(200).json({ message: "동네 고양이 도감 삭제" });
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteStreetCat = deleteStreetCat;
