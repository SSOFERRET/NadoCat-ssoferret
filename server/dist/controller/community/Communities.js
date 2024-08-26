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
exports.deleteCommunity = exports.updateCommunity = exports.createCommunity = exports.getCommunity = exports.getCommunities = void 0;
const http_status_codes_1 = require("http-status-codes");
const client_1 = __importDefault(require("../../client"));
const community_model_1 = require("../../model/community.model");
const image_model_1 = require("../../model/image.model");
const tag_model_1 = require("../../model/tag.model");
const communityComment_model_1 = require("../../model/communityComment.model");
const errors_1 = require("../../util/errors/errors");
const category_1 = require("../../constants/category");
const like_model_1 = require("../../model/like.model");
const Notifications_1 = require("../notification/Notifications");
const Searches_1 = require("../search/Searches");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
const addNewImages_1 = require("../../util/images/addNewImages");
// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] 페이지네이션 추가
// [x] 최신순 정렬
// [x] 조회순 정렬
// [x] 인기순 정렬
// [ ] 에러처리 자세하게 구현하기
const getCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const limit = Number(req.query.limit) || 5;
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const sort = (_b = (_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "latest";
        const count = yield (0, community_model_1.getCommunitiesCount)();
        const communities = yield (0, community_model_1.getCommunityList)(limit, sort, cursor);
        const nextCursor = communities.length === limit ? communities[communities.length - 1].postId : null;
        const result = {
            posts: communities,
            pagination: {
                nextCursor,
                totalCount: count,
            },
        };
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        console.log("게시판 목록 에러 발생");
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.getCommunities = getCommunities;
// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] likes, liked 추가
// [x] 좋아요 수 구현
// [x] 좋아요 관련 부분 코드 분리
// [ ] 에러처리 자세하게 구현하기
const getCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.headers["x-uuid"];
    try {
        const postId = Number(req.params.community_id);
        const categoryId = category_1.CATEGORY.COMMUNITIES;
        const userId = uuid && Buffer.from(uuid, "hex");
        let result;
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const community = yield (0, community_model_1.getCommunityById)(tx, postId);
            if (!community)
                throw new Error("No Post"); //타입가드
            // // redis 서버 연결 필요하여 주석 처리함.
            // // 공동의 서버에는 나중에 설치할 예정
            // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.STREET_CATS, postId);
            // community.views += viewIncrementResult || 0;
            let liked;
            if (userId) {
                liked = yield (0, like_model_1.getLiked)(tx, postId, categoryId, userId);
            }
            result = Object.assign(Object.assign({}, community), { liked: !!liked });
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.getCommunity = getCommunity;
// CHECKLIST
// [x] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요
const createCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const { title, content, tags } = req.body;
        const tagList = JSON.parse(tags);
        const newPost = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield (0, community_model_1.addCommunity)(tx, userId, title, content);
            const postId = post.postId;
            if (tagList.length > 0) {
                const newTags = yield Promise.all(tagList.map((tag) => (0, tag_model_1.addTag)(tx, tag)));
                const formatedTags = newTags.map((tag) => ({
                    tagId: tag.tagId,
                    postId,
                }));
                yield (0, community_model_1.addCommunityTags)(tx, formatedTags);
            }
            if (req.files) {
                const imageUrls = (yield (0, s3ImageHandler_1.uploadImagesToS3)(req));
                const newImages = yield (0, addNewImages_1.addNewImages)(tx, {
                    userId,
                    postId,
                    categoryId: category_1.CATEGORY.COMMUNITIES,
                }, imageUrls);
                const formatedImages = newImages.map((imageId) => ({
                    imageId,
                    postId,
                }));
                yield (0, community_model_1.addCommunityImages)(tx, formatedImages);
            }
            yield (0, Notifications_1.notifyNewPostToFriends)(userId, category_1.CATEGORY.COMMUNITIES, post.postId);
            return post;
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다.", postId: newPost.postId });
        yield (0, Searches_1.indexResultToOpensearch)(category_1.CATEGORY.COMMUNITIES, newPost.postId);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.createCommunity = createCommunity;
// CHECKLIST
// [x] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요
// [x] 원래 이미지, 태그는 받아오지 않기
const updateCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const postId = Number(req.params.community_id);
        const userId = Buffer.from(uuid, "hex");
        const { title, content, tags, deleteTagIds, deleteImageIds } = req.body;
        if (!title || !content || !tags || !deleteTagIds || !deleteImageIds) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
        }
        const tagList = JSON.parse(tags);
        const tagIds = JSON.parse(deleteTagIds);
        const imageIds = JSON.parse(deleteImageIds);
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, community_model_1.updateCommunityById)(tx, postId, userId, title, content);
            yield (0, community_model_1.removeTagsByIds)(tx, tagIds);
            yield (0, tag_model_1.deleteTags)(tx, tagIds);
            const newTags = yield Promise.all(tagList.map((tag) => (0, tag_model_1.addTag)(tx, tag)));
            const formatedTags = newTags.map((tag) => ({
                tagId: tag.tagId,
                postId,
            }));
            yield (0, community_model_1.addCommunityTags)(tx, formatedTags);
            if (req.files) {
                const imageUrls = (yield (0, s3ImageHandler_1.uploadImagesToS3)(req));
                const newImages = yield (0, addNewImages_1.addNewImages)(tx, {
                    userId,
                    postId,
                    categoryId: category_1.CATEGORY.COMMUNITIES,
                }, imageUrls);
                const formatedImages = newImages.map((imageId) => ({
                    imageId,
                    postId,
                }));
                yield (0, community_model_1.addCommunityImages)(tx, formatedImages);
            }
            yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
            yield (0, community_model_1.removeImagesByIds)(tx, imageIds);
            yield (0, image_model_1.deleteImages)(tx, imageIds);
            yield (0, Searches_1.updateOpensearchDocument)(category_1.CATEGORY.COMMUNITIES, postId, { title, content });
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "게시글이 수정되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.updateCommunity = updateCommunity;
// CHECKLIST
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요
// [x] 테이블 변경에 따른 태그, 이미지 삭제 수정
// [x] 게시글 삭제 시 댓글 삭제 구현
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const postId = Number(req.params.community_id);
        const userId = Buffer.from(uuid, "hex");
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const post = yield (0, community_model_1.getCommunityById)(tx, postId);
            const likeIds = yield (0, community_model_1.getLikeIds)(tx, postId);
            if (!post) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
            }
            if ((_a = post.tags) === null || _a === void 0 ? void 0 : _a.length) {
                const tagIds = post.tags.map((item) => item.tagId);
                yield (0, community_model_1.removeTagsByIds)(tx, tagIds);
                yield (0, tag_model_1.deleteTags)(tx, tagIds);
            }
            if ((_b = post.images) === null || _b === void 0 ? void 0 : _b.length) {
                const imageIds = post.images.map((item) => item.imageId);
                yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
                yield (0, community_model_1.removeImagesByIds)(tx, imageIds);
                yield (0, image_model_1.deleteImages)(tx, imageIds);
            }
            if (likeIds.length) {
                yield (0, community_model_1.removeLikesById)(tx, postId);
                yield (0, like_model_1.removeLikesByIds)(tx, likeIds);
            }
            yield (0, communityComment_model_1.deleteCommentsById)(tx, postId);
            yield (0, community_model_1.removeCommunityById)(tx, postId, userId);
            yield (0, Searches_1.deleteOpensearchDocument)(category_1.CATEGORY.COMMUNITIES, postId);
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.deleteCommunity = deleteCommunity;
