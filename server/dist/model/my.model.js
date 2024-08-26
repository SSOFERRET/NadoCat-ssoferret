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
exports.deleteProfileImageFormats = exports.addProfileImageFormats = exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const deleteImages_1 = require("../util/images/deleteImages");
const addNewImages_1 = require("../util/images/addNewImages");
const prisma = new client_1.PrismaClient();
//[ ]마이페이지
const getUser = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        //사용자 정보 가져오기
        const selectUser = yield prisma.users.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        if (!selectUser) {
            //사실 자기정보라 이러면 안되긴 함
            console.log("사용자를 찾을 수 없습니다.");
            return null;
        }
        return { selectUser };
    }
    catch (error) {
        console.log("마이페이지 사용자 조회 error:", error);
        throw new Error("마이페이지 사용자 조회에서 오류 발생");
    }
});
exports.getUser = getUser;
const updateUser = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        // 사용자 정보 업데이트
        const updateUser = yield prisma.users.update({
            where: {
                uuid: uuidBuffer,
            },
            data: {
                nickname: "테스트",
            },
        });
        return { updateUser };
    }
    catch (error) {
        console.log("마이페이지 사용자 정보 업데이트 error:", error);
        throw new Error("마이페이지 사용자 정보 업데이트에서 오류 발생");
    }
});
exports.updateUser = updateUser;
const deleteUser = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        // 사용자 삭제(inactive로 상태변경)
        const deleteUser = yield prisma.users.update({
            where: {
                uuid: uuidBuffer,
            },
            data: {
                status: "inactive",
            },
        });
        return { deleteUser };
    }
    catch (error) {
        console.log("마이페이지 사용자 삭제 error:", error);
        throw new Error("마이페이지 사용자 삭제에서 오류 발생");
    }
});
exports.deleteUser = deleteUser;
//프로필 이미지 저장 로직 추가
const addProfileImageFormats = (uuid, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, addNewImages_1.addProfileImages)(imageUrl, uuid);
});
exports.addProfileImageFormats = addProfileImageFormats;
//프로필 이미지 삭제 로직 추가(기본이미지 변경)
const deleteProfileImageFormats = (uuid, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, deleteImages_1.deleteProfileImages)(imageUrl, uuid);
});
exports.deleteProfileImageFormats = deleteProfileImageFormats;
