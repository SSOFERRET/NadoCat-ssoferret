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
exports.updateFoundState = exports.validateError = exports.validateInternalServerError = exports.validateBadRequest = exports.updateMissing = exports.deleteMissing = exports.createMissing = exports.getMissing = exports.getMissings = void 0;
const client_1 = __importDefault(require("../../client"));
const http_status_codes_1 = require("http-status-codes");
const client_2 = require("@prisma/client");
const location_model_1 = require("../../model/location.model");
const missing_model_1 = require("../../model/missing.model");
const category_1 = require("../../constants/category");
const addNewImages_1 = require("../../util/images/addNewImages");
const deleteImages_1 = require("../../util/images/deleteImages");
const deleteLocations_1 = require("../../util/locations/deleteLocations");
const MissingReports_1 = require("./MissingReports");
const image_model_1 = require("../../model/image.model");
const pagination_1 = require("../../constants/pagination");
const Common_1 = require("./Common");
const notification_model_1 = require("../../model/notification.model");
const Notifications_1 = require("../notification/Notifications");
const Views_1 = require("../common/Views");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
const errors_1 = require("../../util/errors/errors");
/* CHECKLIST
 * [ ] 사용자 정보 가져오기 반영
 * [x] 구현 내용
 *   [x] create
 *   [x] delete
 *   [x] get
 *   [x] put
 */
const getOrderBy = (sort) => {
    switch (sort) {
        case "latest":
            return { sortBy: "createdAt", sortOrder: "asc" };
        case "oldest":
            return { sortBy: "createdAt", sortOrder: "desc" };
        default:
            throw new Error("일치하는 정렬 기준이 없습니다.");
    }
};
const getMissings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = "latest";
    const listData = {
        limit: Number(req.query.limit) || pagination_1.PAGINATION.LIMIT,
        cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
        orderBy: getOrderBy(sort),
        categoryId: category_1.CATEGORY.MISSINGS,
    };
    return yield (0, Common_1.getPosts)(req, res, listData);
});
exports.getMissings = getMissings;
/**
 *
 * CHECKLIST
 * [x] 이미지 가져오기
 * [x] location 가져오기
 */
const getMissing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.postId);
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const postData = {
                postId,
                categoryId: category_1.CATEGORY.MISSINGS,
            };
            let post = yield (0, missing_model_1.getPostByPostId)(tx, postData);
            const userId = post.users.uuid.toString("hex");
            post.users = Object.assign(Object.assign({}, post.users), { userId });
            const imagesFormats = yield (0, missing_model_1.getImageFormatsByPostId)(tx, postData);
            const images = yield Promise.all((imagesFormats === null || imagesFormats === void 0 ? void 0 : imagesFormats.map((format) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, image_model_1.getImageById)(tx, format.imageId); }))) || []);
            // const reportCount = await getReportCount(postId);
            const viewIncrementResult = yield (0, Views_1.incrementViewCountAsAllowed)(req, tx, category_1.CATEGORY.MISSINGS, postId);
            post.views += viewIncrementResult || 0;
            return res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign(Object.assign({}, post), { images }));
        }));
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            (0, exports.validateError)(res, error);
    }
});
exports.getMissing = getMissing;
/**CHECKLIST
 * [x] missing_locations table에 추가 누락
 */
const createMissing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const missing = JSON.parse(req.body.missing);
        const cat = JSON.parse(req.body.cat);
        const location = JSON.parse(req.body.location);
        const newPost = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newLocation = yield (0, location_model_1.addLocation)(tx, location);
            const userId = Buffer.from(uuid, "hex");
            const catData = Object.assign(Object.assign({}, cat), { uuid: userId });
            const missingCat = yield (0, missing_model_1.addMissingCat)(tx, catData);
            const post = yield (0, missing_model_1.addMissing)(tx, Object.assign(Object.assign({}, missing), { catId: missingCat.missingCatId, uuid: userId, time: new Date(missing.time), locationId: newLocation.locationId }));
            yield (0, missing_model_1.addLocationFormats)(tx, category_1.CATEGORY.MISSINGS, {
                postId: post.postId,
                locationId: newLocation.locationId,
            });
            if (req.files) {
                const imageUrls = yield (0, s3ImageHandler_1.uploadImagesToS3)(req);
                yield (0, addNewImages_1.addNewImages)(tx, {
                    userId,
                    postId: post.postId,
                    categoryId: category_1.CATEGORY.MISSINGS,
                }, imageUrls);
            }
            yield (0, Notifications_1.notifyNewPostToFriends)(userId, category_1.CATEGORY.MISSINGS, post.postId);
            return post;
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).send({ postId: newPost.postId });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            (0, exports.validateError)(res, error);
    }
});
exports.createMissing = createMissing;
/**
 * CHECKLIST
 * [x] location 삭제
 * [x] images 삭제
 * [x] 제보글 삭제
 *
 * */
const deleteMissing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const postId = Number(req.params.postId);
        const postData = {
            userId,
            postId,
            categoryId: category_1.CATEGORY.MISSINGS,
        };
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const missingReports = yield (0, missing_model_1.getMissingReportsByMissingId)(tx, postId);
            if (missingReports)
                yield Promise.all(missingReports.map((report) => (0, MissingReports_1.deleteMissingReport)(req, res, report.postId)));
            const locations = yield (0, deleteLocations_1.getAndDeleteLocationFormats)(tx, postData);
            const images = yield (0, deleteImages_1.getAndDeleteImageFormats)(tx, postData);
            yield (0, missing_model_1.removePost)(tx, postData);
            if (locations)
                yield (0, deleteLocations_1.deleteLocationsByLocationIds)(tx, locations);
            if (images)
                yield (0, deleteImages_1.deleteImagesByImageIds)(tx, images);
        }));
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            return (0, exports.validateError)(res, error);
    }
});
exports.deleteMissing = deleteMissing;
/**
 * CHECKLIST
 * Update
 * [x] 이미지 수정
 * [x] 위치 수정
 * [x] 내용 수정
 *
 * [x] 상태 수정
 * [ ] 조회수 업데이트?
 */
const updateMissing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const postId = Number(req.params.postId);
        const userId = Buffer.from(uuid, "hex");
        const missing = JSON.parse(req.body.missing);
        const cat = JSON.parse(req.body.cat);
        const location = JSON.parse(req.body.location);
        const imageIds = JSON.parse(req.body.deleteImageIds);
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const oldPost = yield (0, missing_model_1.getPostByPostId)(tx, { categoryId: category_1.CATEGORY.MISSINGS, postId });
            yield (0, missing_model_1.updateMissingByPostId)(tx, postId, userId, missing);
            yield (0, missing_model_1.updateMissingCatByCat)(tx, oldPost.missingCats.missingCatId, cat);
            yield (0, s3ImageHandler_1.deleteImageFromS3ByImageId)(tx, imageIds);
            yield (0, missing_model_1.removeImagesByIds)(tx, imageIds);
            yield (0, image_model_1.deleteImages)(tx, imageIds);
            if (req.files) {
                const imageUrls = (yield (0, s3ImageHandler_1.uploadImagesToS3)(req));
                yield (0, addNewImages_1.addNewImages)(tx, {
                    userId,
                    postId,
                    categoryId: category_1.CATEGORY.MISSINGS,
                }, imageUrls);
            }
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "게시글이 수정되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.updateMissing = updateMissing;
const validateBadRequest = (res, error) => {
    console.error(error);
    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
};
exports.validateBadRequest = validateBadRequest;
const validateInternalServerError = (res) => {
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
};
exports.validateInternalServerError = validateInternalServerError;
const validateError = (res, error) => {
    if (error instanceof client_2.Prisma.PrismaClientValidationError)
        return (0, exports.validateBadRequest)(res, error);
    return (0, exports.validateInternalServerError)(res);
};
exports.validateError = validateError;
const updateFoundState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const postId = Number(req.params.postId);
        const { found } = req.body;
        const postData = {
            postId,
            userId,
            categoryId: category_1.CATEGORY.MISSINGS,
        };
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, missing_model_1.updateFoundByPostId)(tx, postData, found);
            const receivers = [...(yield (0, notification_model_1.getMissingReporters)(tx, postId)), ...(yield (0, notification_model_1.getMissingFavoriteAdders)(tx, postId))];
            receivers.forEach((receiver) => (0, Notifications_1.notify)({
                type: "found",
                receiver: receiver.uuid.toString("hex"),
                sender: userId.toString("hex"),
                url: `/boards/missings/${postId}`,
            }));
        }));
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "게시글이 상태가 변경 되었습니다." });
    }
    catch (error) {
        if (error instanceof Error)
            return (0, exports.validateError)(res, error);
    }
});
exports.updateFoundState = updateFoundState;
