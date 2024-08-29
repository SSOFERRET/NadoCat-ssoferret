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
exports.deleteProfileImageFormats = exports.addProfileImageFormats = exports.getMyAllPosts = exports.deleteUserInactive = exports.updateNewPassword = exports.getAuthPassword = exports.updateNewDetail = exports.updateNewNickname = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const deleteImages_1 = require("../util/images/deleteImages");
const addNewImages_1 = require("../util/images/addNewImages");
const prisma = new client_1.PrismaClient();
const selectCommunities = {
    users: {
        select: {
            id: true,
            uuid: true,
            nickname: true,
            profileImage: true,
        },
    },
    communityImages: {
        take: 1, // 각 게시물의 첫 번째 이미지만 가져옴
        select: {
            images: {
                select: {
                    imageId: true,
                    url: true,
                },
            },
        },
    },
    communityTags: {
        select: {
            tags: {
                select: {
                    tagId: true,
                    tag: true,
                },
            },
        },
    },
    _count: {
        select: {
            communityLikes: true, // 각 게시물의 좋아요 수를 포함
        },
    },
};
//[x]사용자 조회
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
            return null;
        }
        return { selectUser };
    }
    catch (error) {
        throw new Error("마이페이지 사용자 조회에서 오류 발생");
    }
});
exports.getUser = getUser;
// [x]사용자 닉네임 변경
const updateNewNickname = (uuid, newNickname) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        // 사용자 정보 업데이트
        const updateUser = yield prisma.users.update({
            where: {
                uuid: uuidBuffer,
            },
            data: {
                nickname: newNickname,
            },
        });
        return { updateUser };
    }
    catch (error) {
        throw new Error("마이페이지 사용자 닉네임 업데이트에서 오류 발생");
    }
});
exports.updateNewNickname = updateNewNickname;
// [x]사용자 자기소개
const updateNewDetail = (uuid, newDetail) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        // 사용자 정보 업데이트
        const updateUser = yield prisma.users.update({
            where: {
                uuid: uuidBuffer,
            },
            data: {
                detail: newDetail,
            },
        });
        return { updateUser };
    }
    catch (error) {
        throw new Error("마이페이지 사용자 자기소개 업데이트에서 오류 발생");
    }
});
exports.updateNewDetail = updateNewDetail;
// [x]사용자 비밀번호 검증
const getAuthPassword = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        //사용자 정보 가져오기
        const selectUserSecrets = yield prisma.userSecrets.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        if (!selectUserSecrets) {
            //사실 자기정보라 이러면 안되긴 함
            return null;
        }
        return { selectUserSecrets };
    }
    catch (error) {
        throw new Error("마이페이지 사용자 조회에서 오류 발생");
    }
});
exports.getAuthPassword = getAuthPassword;
// [x]사용자 비밀번호 변경
const updateNewPassword = (uuid, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const hashing = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const saltRound = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRound);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        return { salt, hashPassword };
    });
    const { salt, hashPassword } = yield hashing(newPassword);
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        const selectUserSecrets = yield prisma.userSecrets.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        if (!selectUserSecrets) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }
        // 사용자 정보 업데이트
        const updateUser = yield prisma.userSecrets.update({
            where: {
                userSecretId: selectUserSecrets.userSecretId,
            },
            data: {
                salt: salt,
                hashPassword: hashPassword,
            },
        });
        return { updateUser };
    }
    catch (error) {
        throw new Error("마이페이지 사용자 정보 업데이트에서 오류 발생");
    }
});
exports.updateNewPassword = updateNewPassword;
//[x]회원탈퇴
const deleteUserInactive = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        // 사용자 정보 업데이트
        const updateUser = yield prisma.users.update({
            where: {
                uuid: uuidBuffer,
            },
            data: {
                status: "inactive",
            },
        });
        return { updateUser };
    }
    catch (error) {
        throw new Error("회원탈퇴에서 오류 발생");
    }
});
exports.deleteUserInactive = deleteUserInactive;
//[ ]작성글
const getMyAllPosts = (uuid, page, pageSize, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
    try {
        //여러 게시판에서 가져오기
        const communities = yield prisma.communities.findMany({
            where: {
                uuid: uuidBuffer,
            },
            take: pageSize, //10 (한번의 요청으로 몇개?)
            skip: cursor ? 1 : 0, //cursor가 있다면 1 건너뛰고, 아니면 0 건너뜀
            cursor: cursor ? { postId: cursor } : undefined,
            orderBy: {
                createdAt: "desc",
            },
            include: selectCommunities,
            //});  //충돌 헷갈림
            //if (!posts || posts.length === 0) {
        });
        const posts = communities.map((community) => {
            var _a;
            return {
                postId: community.postId,
                categoryId: community.categoryId,
                title: community.title,
                content: community.content,
                views: community.views,
                createdAt: community.createdAt,
                updatedAt: community.updatedAt,
                users: {
                    id: community === null || community === void 0 ? void 0 : community.users.id,
                    uuid: (community === null || community === void 0 ? void 0 : community.users.uuid).toString("hex"),
                    nickname: community === null || community === void 0 ? void 0 : community.users.nickname,
                    profileImage: community === null || community === void 0 ? void 0 : community.users.profileImage,
                },
                thumbnail: (_a = community.communityImages.map((item) => item.images.url).join("")) !== null && _a !== void 0 ? _a : null,
                likes: community._count.communityLikes,
            };
        });
        if (!posts || posts.length === 0) {
            console.log("작성한 글을 찾을 수 없습니다.");
            return null;
        }
        return posts;
    }
    catch (error) {
        throw new Error("작성글 조회에서 오류 발생");
    }
});
exports.getMyAllPosts = getMyAllPosts;
//[x]프로필 이미지 저장 로직 추가
const addProfileImageFormats = (uuid, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, addNewImages_1.addProfileImages)(imageUrl, uuid);
});
exports.addProfileImageFormats = addProfileImageFormats;
//[x]프로필 이미지 삭제 로직 추가(기본이미지 변경)
const deleteProfileImageFormats = (uuid, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, deleteImages_1.deleteProfileImages)(imageUrl, uuid);
});
exports.deleteProfileImageFormats = deleteProfileImageFormats;
