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
exports.deleteProfile = exports.updateProfile = exports.updatePassword = exports.updateNickname = exports.mypage = void 0;
const http_status_codes_1 = require("http-status-codes");
const my_model_1 = require("../../model/my.model");
const s3ImageHandler_1 = require("../../util/images/s3ImageHandler");
const image_model_1 = require("../../model/image.model");
//[x]마이페이지
const mypage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("my컨트롤러가 호출되었습니다.");
    const requestUuid = req.params.uuid; // URL에서 가져온 UUID
    const loginUuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid; // 로그인한 사용자의 UUID
    console.log("요청 유저:", requestUuid);
    console.log("로그인 유저:", loginUuid);
    try {
        console.log("req.user:", req.user); // 디버깅을 위해 로그 추가
        //사용자 정보 가져오기
        const user = yield (0, my_model_1.getUser)(requestUuid); // UUID로 URL 사용자 정보 가져오기
        console.log("사용자 정보: ", user);
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
                pprofileImageUrl: user.selectUser.profileImage,
                uuid: requestUuid
            };
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "마이페이지입니다.",
            user: userInfo,
        });
    }
    catch (error) {
        console.error("에러 발생!!: ", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "마이페이지에서 서버 오류가 발생했습니다." });
    }
    ;
});
exports.mypage = mypage;
const updateNickname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {uuid}
});
exports.updateNickname = updateNickname;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.updatePassword = updatePassword;
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
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "이미지가 업데이트 되었습니다.", imageUrl: newImageUrl });
        // 기존 이미지 삭제 작업 비동기로 처리
        if (oldProfileImageUrl && oldProfileImageUrl !== defaultUrl) {
            (0, s3ImageHandler_1.deleteSingleImageToS3)(oldProfileImageUrl)
                .then(() => console.log("기존 이미지 삭제 완료"))
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
        console.log("현재이미지: ", currentProfileImageUrl);
        if (!currentProfileImageUrl) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "삭제할 프로필 이미지가 없습니다." });
        }
        const imageUrl = yield (0, s3ImageHandler_1.deleteSingleImageToS3)(currentProfileImageUrl); // 기존 이미지를 삭제
        yield (0, image_model_1.deleteProfileImage)(req.body.imageUrl, req.user.uuid); // DB에서 기본 이미지 URL로 업데이트
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "이미지가 기본으로 변경 되었습니다.", imageUrl: imageUrl });
    }
    catch (error) {
        console.error("프로필 이미지 삭제 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
exports.deleteProfile = deleteProfile;
