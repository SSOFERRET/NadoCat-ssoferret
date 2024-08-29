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
exports.updateMissingReportCheck = exports.updateMissingReport = exports.deleteMissingReportHandler = exports.deleteMissingReport = exports.createMissingReport = exports.getMissingReport = exports.getMissingReports = void 0;
const client_1 = __importDefault(require("../../client"));
const http_status_codes_1 = require("http-status-codes");
const location_model_1 = require("../../model/location.model");
const missing_model_1 = require("../../model/missing.model");
const Missings_1 = require("./Missings");
const category_1 = require("../../constants/category");
const deleteLocations_1 = require("../../util/locations/deleteLocations");
const deleteImages_1 = require("../../util/images/deleteImages");
const addNewImages_1 = require("../../util/images/addNewImages");
const image_model_1 = require("../../model/image.model");
const pagination_1 = require("../../constants/pagination");
const Common_1 = require("./Common");
// import { notify } from "../notification/Notifications";
const errors_1 = require("../../util/errors/errors");
const Views_1 = require("../common/Views");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
/* CHECKLIST
 * [ ] 사용자 정보 가져오기 반영
 * [ ] 구현 내용
 *   [x] create
 *   [x] delete
 *   [x] get
 *   [x] 전체 조회
 *     [x] 페이지네이션
 *   [x] put
 *     [x] 일치 및 불일치
 */
/**
 *
 * CHECKLIST
 * [x] 이미지 가져오기
 * [x] location 가져오기
 */
const getMissingReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listData = {
        limit: Number(req.query.limit) || pagination_1.PAGINATION.LIMIT,
        cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
        orderBy: { sortBy: "createdAt", sortOrder: "asc" },
        categoryId: category_1.CATEGORY.MISSING_REPORTS,
    };
    const missingId = Number(req.params.missingId);
    return yield (0, Common_1.getPosts)(req, res, listData, missingId);
});
exports.getMissingReports = getMissingReports;
const getMissingReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const postId = Number(req.params.postId);
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const postData = {
                postId,
                categoryId: category_1.CATEGORY.MISSING_REPORTS,
                userId,
            };
            let post = yield (0, missing_model_1.getPostByPostId)(tx, postData);
            const locationFormats = yield (0, missing_model_1.getLocationFormatsByPostId)(tx, postData);
            if (locationFormats) {
                const locations = yield Promise.all(locationFormats.map((locationFormat) => (0, location_model_1.getLocationById)(tx, locationFormat.locationId)));
                post = Object.assign(Object.assign({}, post), { locations });
            }
            const imageFormats = yield (0, missing_model_1.getImageFormatsByPostId)(tx, postData);
            if (imageFormats) {
                const images = yield Promise.all(imageFormats.map((imageFormat) => (0, image_model_1.getImageById)(tx, imageFormat.imageId)));
                post = Object.assign(Object.assign({}, post), { images });
            }
            const viewIncrementResult = yield (0, Views_1.incrementViewCountAsAllowed)(req, tx, category_1.CATEGORY.MISSING_REPORTS, postId);
            post.views += viewIncrementResult || 0;
            return res.status(http_status_codes_1.StatusCodes.OK).json(post);
        }));
    }
    catch (error) {
        if (error instanceof Error)
            (0, Missings_1.validateError)(res, error);
    }
});
exports.getMissingReport = getMissingReport;
const createMissingReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        // const userId = await getUserId();
        const userId = Buffer.from(uuid, "hex");
        const missingId = Number(req.params.postId);
        const report = JSON.parse(req.body.report);
        const location = JSON.parse(req.body.location);
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newLocation = yield (0, location_model_1.addLocation)(tx, location);
            const post = yield (0, missing_model_1.addMissingReport)(tx, Object.assign(Object.assign({}, report), { uuid: userId, time: new Date(report.time), locationId: newLocation.locationId, missingId }));
            yield (0, missing_model_1.addLocationFormats)(tx, category_1.CATEGORY.MISSING_REPORTS, {
                postId: post.postId,
                locationId: newLocation.locationId,
            });
            if (req.files) {
                const imageUrls = (yield (0, s3ImageHandler_1.uploadImagesToS3)(req));
                yield (0, addNewImages_1.addNewImages)(tx, {
                    userId,
                    postId: post.postId,
                    categoryId: category_1.CATEGORY.MISSING_REPORTS,
                }, imageUrls);
            }
            // notify({
            //   type: "newPost",
            //   receiver: userId, //NOTE userId를 실종고양이 게시글 게시자로 변경(-)
            //   sender: userId,
            //   url: `/boards/missings/${missingId}/reports/${post.postId}`
            // });
        }));
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다." });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            (0, Missings_1.validateError)(res, error);
    }
});
exports.createMissingReport = createMissingReport;
/**
 * CHECKLIST
 * DELETE
 * [x] location 삭제
 * [x] images 삭제
 *
 * */
const deleteMissingReport = (req, res, postIdInput) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const missingId = Number(req.params.missingId);
        const postId = postIdInput ? postIdInput : Number(req.params.postId);
        const postData = {
            userId,
            categoryId: category_1.CATEGORY.MISSING_REPORTS,
            postId,
        };
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const locations = yield (0, deleteLocations_1.getAndDeleteLocationFormats)(tx, postData);
            const images = yield (0, deleteImages_1.getAndDeleteImageFormats)(tx, postData);
            yield (0, missing_model_1.removePost)(tx, postData);
            if (locations)
                yield (0, deleteLocations_1.deleteLocationsByLocationIds)(tx, locations);
            if (images)
                yield (0, deleteImages_1.deleteImagesByImageIds)(tx, images);
        }));
        return res.status(http_status_codes_1.StatusCodes.OK).json("제보글 삭제");
    }
    catch (error) {
        return (0, errors_1.handleControllerError)(error, res);
    }
});
exports.deleteMissingReport = deleteMissingReport;
const deleteMissingReportHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.deleteMissingReport)(req, res);
    }
    catch (error) {
        if (error instanceof Error)
            return (0, Missings_1.validateError)(res, error);
    }
});
exports.deleteMissingReportHandler = deleteMissingReportHandler;
const updateMissingReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // NOTE Full Update?인지 확인
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const missingId = Number(req.params.missingId);
        const postId = Number(req.params.postId);
        const { report, location, images } = req.body;
        const postData = {
            postId,
            userId,
            categoryId: category_1.CATEGORY.MISSING_REPORTS,
        };
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield (0, missing_model_1.getPostByPostId)(tx, postData);
            if (!post || !report || !location)
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값 확인 요망" });
            const locationId = post.locationId;
            if (locationId)
                yield (0, location_model_1.updateLocationById)(tx, locationId, location);
            yield (0, missing_model_1.updateMissingReportByPostId)(tx, postId, userId, report.detail, new Date(report.time));
            const imagesToDelete = yield (0, deleteImages_1.getAndDeleteImageFormats)(tx, postData);
            if (imagesToDelete)
                yield (0, deleteImages_1.deleteImagesByImageIds)(tx, imagesToDelete);
            if (images) {
                yield (0, addNewImages_1.addNewImages)(tx, postData, images);
            }
            // notify({
            //   type: "update",
            //   receiver: userId, //NOTE userId를 실종고양이 게시글 게시자로 변경(-)
            //   sender: userId,
            //   url: `/boards/missings/${missingId}/reports/${postId}`
            // });
        }));
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "게시글이 수정되었습니다." });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            return (0, Missings_1.validateError)(res, error);
    }
});
exports.updateMissingReport = updateMissingReport;
const updateMissingReportCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const postData = {
            postId: Number(req.params.postId),
            categoryId: category_1.CATEGORY.MISSING_REPORTS,
            userId,
        };
        const { match } = req.body;
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const reportPost = yield (0, missing_model_1.getPostByPostId)(tx, postData);
            const missingPost = yield (0, missing_model_1.getPostByPostId)(tx, {
                postId: reportPost.missingId,
                categoryId: category_1.CATEGORY.MISSINGS,
                userId: reportPost.uuid,
            }); // NOTE 게시글 작성자 인가 추가
            yield (0, missing_model_1.updateMissingReportCheckByPostId)(tx, postData, match);
            // notify({
            //   type: "match",
            //   receiver: userId,
            //   sender: userId, //NOTE userId를 실종고양이 게시글 게시자로 변경(-)
            //   result: match,
            //   url: `/boards/missings/${missingPost.postId}/reports/${postData.postId}`,
            // });
            return res.status(http_status_codes_1.StatusCodes.OK).json("게시글 상태가 업데이트 되었습니다.");
        }));
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error)
            return (0, Missings_1.validateError)(res, error);
    }
});
exports.updateMissingReportCheck = updateMissingReportCheck;
