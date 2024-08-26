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
exports.getProfileImage = exports.deleteProfileImage = exports.addProfileImage = exports.getImageById = exports.addImage = exports.deleteImages = void 0;
const client_1 = __importDefault(require("../client"));
const deleteImages = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.images.deleteMany({
        where: {
            imageId: {
                in: imageIds,
            },
        },
    });
});
exports.deleteImages = deleteImages;
const addImage = (tx, url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.images.create({
        data: {
            url,
        },
    });
});
exports.addImage = addImage;
const getImageById = (tx, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.images.findUnique({
        where: {
            imageId,
        },
    });
});
exports.getImageById = getImageById;
//프로필 이미지 변경
const addProfileImage = (url, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex");
    const user = yield client_1.default.users.findFirst({
        where: { uuid: uuidBuffer },
    });
    if (!user) {
        console.error(`사용자를 찾을 수 없습니다. user: ${user}, uuid: ${uuid}`);
        return;
    }
    try {
        return yield client_1.default.users.update({
            where: {
                uuid: uuidBuffer,
            },
            data: {
                profileImage: url,
            },
        });
    }
    catch (error) {
        console.error("프로필 이미지 업데이트 중 오류 발생:", error);
        throw error;
    }
});
exports.addProfileImage = addProfileImage;
//프로필 이미지 기본으로 변경
const deleteProfileImage = (url, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.users.update({
        where: {
            uuid: Buffer.from(uuid, "hex"),
        },
        data: {
            profileImage: url,
        },
    });
});
exports.deleteProfileImage = deleteProfileImage;
//프로필 이미지 조회
const getProfileImage = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.users.findFirst({
        where: {
            uuid: Buffer.from(uuid, "hex")
        }
    });
});
exports.getProfileImage = getProfileImage;
