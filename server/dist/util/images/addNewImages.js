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
exports.addProfileImages = exports.addNewImages = void 0;
const image_model_1 = require("../../model/image.model");
const missing_model_1 = require("../../model/missing.model");
const addNewImages = (tx, postData, images) => __awaiter(void 0, void 0, void 0, function* () {
    const newImages = yield Promise.all(images.map((url) => (0, image_model_1.addImage)(tx, url)));
    const formattedImages = newImages.map((image) => ({
        imageId: image.imageId,
        postId: postData.postId,
    }));
    yield (0, missing_model_1.addImageFormats)(tx, postData.categoryId, formattedImages);
    return formattedImages.map(image => image.imageId);
});
exports.addNewImages = addNewImages;
//프로필 이미지 변경
const addProfileImages = (uuid, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const newImage = yield (0, image_model_1.addProfileImage)(uuid, imageUrl);
    return newImage;
});
exports.addProfileImages = addProfileImages;
