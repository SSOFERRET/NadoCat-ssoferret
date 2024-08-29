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
exports.getMyPosts = exports.deleteProfile = exports.updateProfile = exports.deleteUser = exports.updatePassword = exports.authPassword = exports.updateDetail = exports.updateNickname = exports.userPage = exports.myPage = void 0;
const http_status_codes_1 = require("http-status-codes");
const my_model_1 = require("../../model/my.model");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
const image_model_1 = require("../../model/image.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
//[x]마이페이지
const myPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    try {
        //사용자 정보 가져오기
        const user = yield (0, my_model_1.getUser)(loginUuid); // UUID로 URL 사용자 정보 가져오기
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "마이페이지입니다.",
            user: {
                email: user.selectUser.email,
                nickname: user.selectUser.nickname,
                profileImageUrl: user.selectUser.profileImage,
                uuid: loginUuid,
            },
        });
    }
    catch (error) {
        console.error("에러 발생!!: ", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "마이페이지에서 서버 오류가 발생했습니다." });
    }
});
exports.myPage = myPage;
//[x]사용자 프로필 페이지
const userPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requestUuid = req.params.uuid; // URL에서 가져온 UUID
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    try {
        // if (loginUuid === requestUuid) {
        //   // 마이페이지로 리다이렉트
        //   return myPage(req, res, next);
        // }
        //사용자 정보 가져오기
        const user = yield (0, my_model_1.getUser)(requestUuid); // UUID로 URL 사용자 정보 가져오기
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        let userInfo;
        if (loginUuid === requestUuid) {
            //마이페이지
            userInfo = {
                email: user.selectUser.email,
                nickname: user.selectUser.nickname,
                profileImageUrl: user.selectUser.profileImage,
                uuid: loginUuid,
            };
        }
        else {
            //프로필
            userInfo = {
                nickname: user.selectUser.nickname,
                profileImageUrl: user.selectUser.profileImage,
                uuid: requestUuid,
            };
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "사용자 프로필 페이지입니다.",
            user: userInfo,
        });
    }
    catch (error) {
        console.error("에러 발생!!: ", error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "사용자 프로필 페이지에서 서버 오류가 발생했습니다." });
    }
});
exports.userPage = userPage;
//[x]닉네임
const updateNickname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    try {
        const user = yield (0, my_model_1.getUser)(loginUuid); // UUID로 URL 사용자 정보 가져오기
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        const newNickname = (0, my_model_1.updateNewNickname)(loginUuid, req.body.nickname);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "닉네임이 변경되었습니다.",
            nickname: newNickname,
        });
    }
    catch (error) {
        console.error("에러 발생!!: ", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "닉네임 변경 중 서버 오류가 발생했습니다." });
    }
});
exports.updateNickname = updateNickname;
//[x]자기소개
const updateDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    try {
        const user = yield (0, my_model_1.getUser)(loginUuid);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        const newDetail = (0, my_model_1.updateNewDetail)(loginUuid, req.body.detail);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "자기소개가 변경되었습니다.",
            detail: newDetail,
        });
    }
    catch (error) {
        console.error("자기소개 변경 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.updateDetail = updateDetail;
const authPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    try {
        const user = yield (0, my_model_1.getAuthPassword)(loginUuid);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        const inputPassword = req.body.password; // URL에서 가져온 UUID
        const dbPassword = user.selectUserSecrets.hashPassword;
        if (dbPassword) {
            const isPasswordValid = yield bcrypt_1.default.compare(inputPassword, dbPassword);
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "비밀번호가 일치하지 않습니다.",
                });
            }
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "비밀번호가 일치합니다!",
            password: "correct",
        });
    }
    catch (error) {
        console.error("비밀번호 확인 중 오류 발생:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.authPassword = authPassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    try {
        const user = yield (0, my_model_1.getAuthPassword)(loginUuid);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        const newPassword = (0, my_model_1.updateNewPassword)(loginUuid, req.body.password);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "비밀번호가 변경되었습니다.",
            password: newPassword,
        });
    }
    catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.updatePassword = updatePassword;
//[ ]회원탈퇴
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUuid = req.body.uuid; // 로그인한 사용자의 UUID
    try {
        const user = yield (0, my_model_1.getUser)(loginUuid);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "사용자를 찾을 수 없습니다." });
        }
        const userInactive = yield (0, my_model_1.deleteUserInactive)(loginUuid);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "비밀번호가 변경되었습니다.",
            status: userInactive,
        });
    }
    catch (error) {
        console.error("회원탈퇴 에러:", error);
        return res.status(500).json({ message: "회원탈퇴 중 오류 발생" });
    }
});
exports.deleteUser = deleteUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "이미지가 업로드되지 않았습니다." });
        }
        // 기존 프로필 이미지 URL을 가져오기 (검증 및 삭제용)
        const user = yield (0, image_model_1.getProfileImage)(req.user.uuid);
        const defaultUrl = "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png";
        const oldProfileImageUrl = (user === null || user === void 0 ? void 0 : user.profileImage) || "";
        // 새 프로필 업로드
        const newImageUrl = yield (0, s3ImageHandler_1.uploadSingleImageToS3)(req);
        if (!newImageUrl) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "이미지 url을 가져오는데 실패했습니다." });
        }
        // DB에 추가
        yield (0, image_model_1.addProfileImage)(newImageUrl, req.user.uuid);
        // 클라이언트에 새로운 이미지 URL을 응답
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "이미지가 업데이트 되었습니다.",
            imageUrl: newImageUrl,
        });
        // 기존 이미지 삭제 작업 비동기로 처리
        if (oldProfileImageUrl && oldProfileImageUrl !== defaultUrl) {
            (0, s3ImageHandler_1.deleteSingleImageToS3)(oldProfileImageUrl)
                .then(() => { })
                .catch((err) => console.error("기존 이미지 삭제 중 오류 발생:", err));
        }
    }
    catch (error) {
        console.error("프로필 이미지 업데이트 중 오류 발생:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.updateProfile = updateProfile;
//기존에 e3에서 삭제하고 다시 db에 기본경로 저장
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, image_model_1.getProfileImage)(req.user.uuid); //user 조회
        const currentProfileImageUrl = user === null || user === void 0 ? void 0 : user.profileImage; // 사용자의 현재 프로필 이미지 URL을 가져옵니다.
        if (!currentProfileImageUrl) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "삭제할 프로필 이미지가 없습니다." });
        }
        const imageUrl = yield (0, s3ImageHandler_1.deleteSingleImageToS3)(currentProfileImageUrl); // 기존 이미지를 삭제
        yield (0, image_model_1.deleteProfileImage)(req.body.imageUrl, req.user.uuid); // DB에서 기본 이미지 URL로 업데이트
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "이미지가 기본으로 변경 되었습니다.",
            imageUrl: imageUrl,
        });
    }
    catch (error) {
        console.error("프로필 이미지 삭제 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.deleteProfile = deleteProfile;
//[ ]작성글
const getMyPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    const page = parseInt(req.query.page) || 1; // 기본값 1 페이지;
    const pageSize = parseInt(req.query.pageSize) || 10; //10개씩
    try {
        const posts = yield (0, my_model_1.getMyAllPosts)(userUuid, page, pageSize);
        return res.status(http_status_codes_1.StatusCodes.OK).json(posts);
    }
    catch (error) {
        console.error("작성한글 조회 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.getMyPosts = getMyPosts;
