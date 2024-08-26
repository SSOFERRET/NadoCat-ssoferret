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
exports.updateFoundState = exports.validateError = exports.validateInternalServerError = exports.validateBadRequest = exports.updateMissing = exports.getUserId2 = exports.getUserId = exports.deleteMissing = exports.createMissing = exports.getMissing = exports.getMissings = void 0;
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
const pagination_1 = require("../../constants/pagination");
const Common_1 = require("./Common");
const notification_model_1 = require("../../model/notification.model");
const Notifications_1 = require("../notification/Notifications");
const Searches_1 = require("../search/Searches");
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
    var _a, _b;
    const sort = (_b = (_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "latest";
    const listData = {
        limit: Number(req.query.limit) || pagination_1.PAGINATION.LIMIT,
        cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
        orderBy: getOrderBy(sort),
        categoryId: category_1.CATEGORY.MISSINGS
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
            const userId = yield (0, exports.getUserId)(); // NOTE
            const postData = {
                postId,
                categoryId: category_1.CATEGORY.MISSINGS,
                userId
            };
            let post = yield (0, missing_model_1.getPostByPostId)(tx, postData);
            //NOTE view
            // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.MISSINGS, postId);
            // post.views += viewIncrementResult || 0;
            return res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json(post);
        }));
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error)
            (0, exports.validateError)(res, error);
    }
});
exports.getMissing = getMissing;
/**CHECKLIST
 * [x] missing_locations table에 추가 누락
*/
const createMissing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { missing, location, cat } = req.body;
        const newPost = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newLocation = yield (0, location_model_1.addLocation)(tx, location);
            // const userId = Buffer.from((authorization.uuid as string).split("-").join(""), "hex");
            const userId = yield (0, exports.getUserId)();
            const catData = Object.assign(Object.assign({}, cat), { uuid: userId });
            const missingCat = yield (0, missing_model_1.addMissingCat)(tx, catData);
            const post = yield (0, missing_model_1.addMissing)(tx, Object.assign(Object.assign({}, missing), { catId: missingCat.missingCatId, uuid: userId, time: new Date(missing.time), locationId: newLocation.locationId }));
            yield (0, missing_model_1.addLocationFormats)(tx, category_1.CATEGORY.MISSINGS, {
                postId: post.postId,
                locationId: newLocation.locationId
            });
            // if (req.files) {
            //   const imageUrls = await uploadImageToS3(req) as string[];
            //   console.log("결과 출력", imageUrls);
            //   await addNewImages(tx, {
            //     userId,
            //     postId: post.postId,
            //     categoryId: CATEGORY.MISSINGS,
            //   }, imageUrls);
            // }
            // await notifyNewPostToFriends(userId, CATEGORY.MISSINGS, post.postId);
            return post;
        }));
        // if (!postId) throw Error("포스트아이디값 없다")
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .send({ postId: newPost.postId });
        yield (0, Searches_1.indexResultToOpensearch)(category_1.CATEGORY.MISSINGS, newPost.postId);
    }
    catch (error) {
        console.log(error);
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
    try {
        const postId = Number(req.params.postId);
        const userId = yield (0, exports.getUserId)(); // NOTE
        const postData = {
            userId,
            postId,
            categoryId: category_1.CATEGORY.MISSINGS
        };
        console.log("삭제할 아이디", postId);
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
            yield (0, Searches_1.deleteOpensearchDocument)(category_1.CATEGORY.MISSINGS, postId);
        }));
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "게시글이 삭제되었습니다." });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            return (0, exports.validateError)(res, error);
    }
});
exports.deleteMissing = deleteMissing;
const getUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.users.findUnique({
        where: {
            id: 1
        }
    });
    if (!result) {
        throw new Error("사용자 정보 없음");
    }
    console.log(result.uuid);
    return result.uuid;
});
exports.getUserId = getUserId;
const getUserId2 = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.users.findUnique({
        where: {
            id: 2
        }
    });
    if (!result) {
        throw new Error("사용자 정보 없음");
    }
    console.log(result.uuid);
    return result.uuid;
});
exports.getUserId2 = getUserId2;
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
    try {
        const postId = Number(req.params.postId);
        const userId = yield (0, exports.getUserId)(); // NOTE
        const { missing, location, images } = req.body;
        const postData = {
            postId,
            userId,
            categoryId: category_1.CATEGORY.MISSINGS
        };
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield (0, missing_model_1.getPostByPostId)(tx, postData);
            if (!post || !missing.catId || !missing.time || !location || !missing.detail)
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값 확인 요망" });
            const locationId = post.locationId;
            if (locationId)
                yield (0, location_model_1.updateLocationById)(tx, locationId, location);
            yield (0, missing_model_1.updateMissingByPostId)(tx, postId, userId, missing.catId, missing.detail, new Date(missing.time));
            const imagesToDelete = yield (0, deleteImages_1.getAndDeleteImageFormats)(tx, postData);
            if (imagesToDelete)
                yield (0, deleteImages_1.deleteImagesByImageIds)(tx, imagesToDelete);
            if (images) {
                yield (0, addNewImages_1.addNewImages)(tx, {
                    userId,
                    postId,
                    categoryId: category_1.CATEGORY.MISSINGS,
                }, images);
            }
            ;
            yield (0, Searches_1.updateOpensearchDocument)(category_1.CATEGORY.MISSINGS, postId, {
                content: missing.detail
            });
        }));
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "게시글이 수정되었습니다." });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error)
            return (0, exports.validateError)(res, error);
    }
});
exports.updateMissing = updateMissing;
const validateBadRequest = (res, error) => {
    console.error(error);
    return res
        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
};
exports.validateBadRequest = validateBadRequest;
const validateInternalServerError = (res) => {
    res
        .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
};
exports.validateInternalServerError = validateInternalServerError;
const validateError = (res, error) => {
    if (error instanceof client_2.Prisma.PrismaClientValidationError)
        return (0, exports.validateBadRequest)(res, error);
    return (0, exports.validateInternalServerError)(res);
};
exports.validateError = validateError;
const updateFoundState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.postId);
        const userId = yield (0, exports.getUserId)(); // NOTE
        const { found } = req.body;
        const postData = {
            postId,
            userId,
            categoryId: category_1.CATEGORY.MISSINGS
        };
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, missing_model_1.updateFoundByPostId)(tx, postData, found);
            const receivers = [...yield (0, notification_model_1.getMissingReporters)(tx, postId), ...yield (0, notification_model_1.getMissingFavoriteAdders)(tx, postId)];
            receivers.forEach((receiver) => (0, Notifications_1.notify)({
                type: "found",
                receiver: receiver.uuid,
                sender: userId,
                url: `/boards/missings/${postId}`,
                result: found ? "Y" : "N"
            }));
        }));
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "게시글이 상태가 변경 되었습니다." });
    }
    catch (error) {
        if (error instanceof Error)
            return (0, exports.validateError)(res, error);
    }
});
exports.updateFoundState = updateFoundState;
