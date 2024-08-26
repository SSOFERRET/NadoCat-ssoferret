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
exports.deleteProfileImages = exports.deleteImagesByImageIds = exports.getAndDeleteImageFormats = void 0;
const image_model_1 = require("../../model/image.model");
const missing_model_1 = require("../../model/missing.model");
const getAndDeleteImageFormats = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield (0, missing_model_1.getImageFormatsByPostId)(tx, postData);
    yield (0, missing_model_1.deleteImageFormats)(tx, postData);
    return images;
});
exports.getAndDeleteImageFormats = getAndDeleteImageFormats;
const deleteImagesByImageIds = (tx, images) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedImages = images.map((image) => image.imageId);
    return yield (0, image_model_1.deleteImages)(tx, formattedImages);
});
exports.deleteImagesByImageIds = deleteImagesByImageIds;
// 프로필 이미지 삭제
const deleteProfileImages = (uuid, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteImage = yield (0, image_model_1.deleteProfileImage)(uuid, imageUrl);
    return deleteImage;
});
exports.deleteProfileImages = deleteProfileImages;
