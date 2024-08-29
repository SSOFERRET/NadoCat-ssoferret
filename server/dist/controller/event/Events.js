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
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getEvents = void 0;
const client_1 = __importDefault(require("../../client"));
const client_2 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const tag_model_1 = require("../../model/tag.model");
const image_model_1 = require("../../model/image.model");
const event_model_1 = require("../../model/event.model");
const eventComment_model_1 = require("../../model/eventComment.model");
const errors_1 = require("../../util/errors/errors");
const category_1 = require("../../constants/category");
const like_model_1 = require("../../model/like.model");
const Notifications_1 = require("../notification/Notifications");
const Views_1 = require("../common/Views");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
const addNewImages_1 = require("../../util/images/addNewImages");
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = Number(req.query.limit) || 5;
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const sort = ((_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.toString()) || "latest";
        const count = yield (0, event_model_1.getEventsCount)();
        const posts = yield (0, event_model_1.getEventList)(limit, sort, cursor);
        const nextCursor = posts.length === limit ? posts[posts.length - 1].postId : null;
        const result = {
            posts,
            pagination: {
                nextCursor,
                totalCount: count,
            },
        };
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.getEvents = getEvents;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.headers["x-uuid"];
    try {
        const postId = Number(req.params.event_id);
        const categoryId = category_1.CATEGORY.EVENTS;
        const userId = uuid && Buffer.from(uuid, "hex");
        let result;
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield (0, event_model_1.getEventById)(tx, postId);
            if (!post) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
            }
            let liked;
            if (userId) {
                liked = yield (0, like_model_1.getLiked)(tx, postId, categoryId, userId);
            }
            result = Object.assign(Object.assign({}, post), { liked: !!liked });
            const viewIncrementResult = yield (0, Views_1.incrementViewCountAsAllowed)(req, tx, category_1.CATEGORY.EVENTS, postId);
            post.views += viewIncrementResult || 0;
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.getEvent = getEvent;
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const { title, content, isClosed, tags } = req.body;
        const tagList = JSON.parse(tags);
        const userId = Buffer.from(uuid, "hex");
        const newPost = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield (0, event_model_1.addEvent)(tx, userId, title, content, !!isClosed);
            const postId = post.postId;
            if (tagList.length > 0) {
                const newTags = yield Promise.all(tagList.map((tag) => (0, tag_model_1.addTag)(tx, tag)));
                const formatedTags = newTags.map((tag) => ({
                    tagId: tag.tagId,
                    postId: post.postId,
                }));
                yield (0, event_model_1.addEventTags)(tx, formatedTags);
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
                yield (0, event_model_1.addEventImages)(tx, formatedImages);
            }
            yield (0, Notifications_1.notifyNewPostToFriends)(userId, category_1.CATEGORY.EVENTS, post.postId);
            return post;
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다.", postId: newPost.postId });
    }
    catch (error) {
        console.error(error);
        if (error instanceof client_2.Prisma.PrismaClientValidationError) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.createEvent = createEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const postId = Number(req.params.event_id);
        const { title, content, tags, deleteTagIds, deleteImageIds, isClosed } = req.body;
        if (!title || !content || !tags || !deleteTagIds || !deleteImageIds) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
        }
        const tagList = JSON.parse(tags);
        const tagIds = JSON.parse(deleteTagIds);
        const imageIds = JSON.parse(deleteImageIds);
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, event_model_1.updateEventById)(tx, userId, postId, title, content, !!isClosed);
            yield (0, event_model_1.removeTagsByIds)(tx, tagIds);
            yield (0, tag_model_1.deleteTags)(tx, tagIds);
            const newTags = yield Promise.all(tagList.map((tag) => (0, tag_model_1.addTag)(tx, tag)));
            const formatedTags = newTags.map((tag) => ({
                tagId: tag.tagId,
                postId,
            }));
            yield (0, event_model_1.addEventTags)(tx, formatedTags);
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
                yield (0, event_model_1.addEventImages)(tx, formatedImages);
            }
            yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
            yield (0, event_model_1.removeImagesByIds)(tx, imageIds);
            yield (0, image_model_1.deleteImages)(tx, imageIds);
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "게시글이 수정되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const postId = Number(req.params.event_id);
        const userId = Buffer.from(uuid, "hex");
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const post = yield (0, event_model_1.getEventById)(tx, postId);
            const likeIds = yield (0, event_model_1.getLikeIds)(tx, postId);
            if (!post) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
            }
            if ((_a = post.tags) === null || _a === void 0 ? void 0 : _a.length) {
                const tagIds = post.tags.map((item) => item.tagId);
                yield (0, event_model_1.removeTagsByIds)(tx, tagIds);
                yield (0, tag_model_1.deleteTags)(tx, tagIds);
            }
            if ((_b = post.images) === null || _b === void 0 ? void 0 : _b.length) {
                const imageIds = post.images.map((item) => item.imageId);
                yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
                yield (0, event_model_1.removeImagesByIds)(tx, imageIds);
                yield (0, image_model_1.deleteImages)(tx, imageIds);
            }
            if (likeIds.length) {
                yield (0, event_model_1.removeLikesById)(tx, postId);
                yield (0, like_model_1.removeLikesByIds)(tx, likeIds);
            }
            yield (0, eventComment_model_1.deleteCommentsById)(tx, postId);
            yield (0, event_model_1.removeEventById)(tx, postId, userId);
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.deleteEvent = deleteEvent;
