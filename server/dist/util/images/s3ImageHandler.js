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
exports.deleteSingleImageToS3 = exports.uploadSingleImageToS3 = exports.getImageUrlsFromDb = exports.deleteImageFromS3ByImageId = exports.deleteImageFromS3 = exports.uploadImagesToS3 = void 0;
const convertToWebpBuffer_1 = require("./convertToWebpBuffer");
const s3_1 = __importDefault(require("../../s3"));
const dotenv_1 = __importDefault(require("dotenv"));
const missing_model_1 = require("../../model/missing.model");
const client_1 = __importDefault(require("../../client"));
const image_model_1 = require("../../model/image.model");
const lz_string_1 = require("lz-string");
dotenv_1.default.config();
//복수
const uploadImagesToS3 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files)
        return;
    const images = req.files;
    try {
        const results = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            const keyName = `${(0, lz_string_1.compressToEncodedURIComponent)(image.originalname)}_${Date.now()}`;
            const result = yield s3_1.default.upload({
                Bucket: "nadocat",
                Key: keyName,
                Body: yield (0, convertToWebpBuffer_1.convertToWebpBuffer)(image),
                ContentType: image.mimetype,
            }, (error, data) => {
                if (error)
                    throw error;
                console.log(`파일 업로드 성공~! ${data.Location}`);
            }).promise();
            return result.Location;
        })));
        return results;
    }
    catch (error) {
        throw error;
    }
});
exports.uploadImagesToS3 = uploadImagesToS3;
const deleteImageFromS3 = (images) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            const urlSplit = image.url.split("/");
            const keyName = urlSplit[urlSplit.length - 1];
            yield s3_1.default.deleteObject({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: keyName
            }).promise();
        })));
    }
    catch (error) {
        throw error;
    }
});
exports.deleteImageFromS3 = deleteImageFromS3;
const deleteImageFromS3ByImageId = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    const imageDatasToDelete = yield Promise.all(imageIds.map((imageId) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, image_model_1.getImageById)(tx, imageId); })));
    yield (0, exports.deleteImageFromS3)(imageDatasToDelete);
});
exports.deleteImageFromS3ByImageId = deleteImageFromS3ByImageId;
const getImageUrlsFromDb = (categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrls = yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const imageIds = yield (0, missing_model_1.getImageFormatsByPostId)(tx, { categoryId, postId }).then((images) => images === null || images === void 0 ? void 0 : images.map(image => image.imageId));
        const imageUrls = yield Promise.all(imageIds === null || imageIds === void 0 ? void 0 : imageIds.map((imageId) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, image_model_1.getImageById)(tx, imageId).then(data => data === null || data === void 0 ? void 0 : data.url); })));
        return imageUrls;
    }));
    return imageUrls;
});
exports.getImageUrlsFromDb = getImageUrlsFromDb;
//단일 업로드
const uploadSingleImageToS3 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return;
    const image = req.file;
    try {
        const keyName = `${(0, lz_string_1.compressToEncodedURIComponent)(image.originalname)}_${Date.now()}`;
        const result = yield s3_1.default.upload({
            Bucket: "nadocat",
            Key: keyName,
            Body: yield (0, convertToWebpBuffer_1.convertToWebpBuffer)(image),
            ContentType: image.mimetype,
        }).promise();
        console.log(`파일 업로드 성공~! ${result.Location}`);
        return result.Location; // 이미지 URL 반환
    }
    catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
        throw error;
    }
});
exports.uploadSingleImageToS3 = uploadSingleImageToS3;
//단일 삭제
const deleteSingleImageToS3 = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    if (!imageUrl)
        return;
    try {
        const urlSplit = imageUrl.split("/");
        const keyName = urlSplit[urlSplit.length - 1];
        yield s3_1.default.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: keyName
        }).promise();
        console.log("파일 삭제 완료");
    }
    catch (error) {
        console.error("파일 삭제 중 오류 발생:", error);
        throw error;
    }
});
exports.deleteSingleImageToS3 = deleteSingleImageToS3;
