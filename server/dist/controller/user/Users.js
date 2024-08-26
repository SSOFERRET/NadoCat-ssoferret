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
exports.google = exports.kakao = exports.logout = exports.getNewAccessToken = exports.login = exports.signup = void 0;
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
// import crypto from "crypto";
const user_model_1 = require("../../model/user.model");
// import { Request, Response } from "aws-sdk";
dotenv_1.default.config();
//[x]회원가입
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nickname, password } = req.body;
    //DB저장
    try {
        const result = yield (0, user_model_1.createUser)(email, nickname, password);
        if (result === null) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "이미 사용 중인 이메일입니다." });
        }
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: "회원가입 성공!",
            user: {
                id: result.user.id,
                userId: result.user.uuid,
                email: result.user.email,
                nickname: result.user.nickname,
                authtype: result.user.authType,
            },
        });
    }
    catch (error) {
        console.log("회원가입 error:", error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
    }
});
exports.signup = signup;
//[x]로그인
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, autoLogin } = req.body;
    const isAutoLogin = (autoLogin === 'true' || autoLogin === true);
    const generalTokenMaxAge = parseInt(process.env.GENERAL_TOKEN_MAX_AGE || '300000'); // 5분
    const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000"); // 7일
    try {
        const { generalToken, refreshToken, result, userUuidString } = yield (0, user_model_1.loginUser)(email, password, autoLogin);
        console.log("autoLogin상태: ", autoLogin);
        if (!userUuidString || (!refreshToken && autoLogin)) {
            console.log("유효하지 않은 UUID 또는 Refresh Token입니다.");
            throw new Error("유효하지 않은 값입니다.");
        }
        res.cookie("generalToken", generalToken, {
            httpOnly: true,
            secure: true,
            maxAge: generalTokenMaxAge
        });
        //자동로그인시
        if (isAutoLogin) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: refreshTokenMaxAge
            });
            //refresh token DB 저장
            yield (0, user_model_1.saveRefreshToken)(userUuidString, refreshToken);
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "로그인 성공",
            user: {
                email: result.selectUser.email,
                nickname: result.selectUser.nickname,
                uuid: userUuidString,
            },
            tokens: {
                accessToken: generalToken,
                refreshToken: refreshToken,
            },
        });
    }
    catch (error) {
        console.log("로그인 error:", error);
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "로그인 처리 중 오류가 발생했습니다." });
    }
});
exports.login = login;
//[x] 액세스 토큰 재발급
const getNewAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body; //body에 들어오는지 어떻게 아는?
    if (!refreshToken) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Refresh token이 존재하지 않습니다." });
    }
    try {
        const newAccessToken = yield (0, user_model_1.refreshAccessToken)(refreshToken);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.log("로그인 error:", error);
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "유효하지 않은 Refresh token입니다." });
    }
});
exports.getNewAccessToken = getNewAccessToken;
//[ ]로그아웃
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.body;
        console.log("유저 컨트롤러 로그아웃 uuid: ", uuid);
        if (!uuid) {
            return res.status(400).json({ message: "UUID가 없습니다." });
        }
        //db에서 refresh token 삭제
        yield (0, user_model_1.logoutUser)(uuid);
        //클라이언트 쿠키제거
        res.clearCookie("generalToken", { httpOnly: true, secure: true });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.clearCookie("uuid", { httpOnly: true, secure: true });
        return res.status(200).json({ message: "로그아웃 성공" });
    }
    catch (error) {
        console.log("로그아웃 에러:", error);
        return res.status(500).json({ message: "로그아웃 중 오류 발생" });
    }
});
exports.logout = logout;
//[ ]카카오
const kakao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    try {
        const tokenResponse = yield axios_1.default.post(process.env.KAKAO_TOKEN_URL, {}, {
            params: {
                grant_type: "authorization_code",
                client_id: process.env.KAKAO_REST_API_KEY,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log("tokenResponse.data 카카오 데이터: ", tokenResponse.data);
        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        const userResponse = yield axios_1.default.get(process.env.KAKAO_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { id, properties, kakao_account } = userResponse.data;
        const email = kakao_account.email;
        const nickname = properties.nickname;
        yield (0, user_model_1.kakaoUser)(email, nickname, access_token, refresh_token, expires_in.toString());
        res.redirect("/signup"); //홈으로 수정
    }
    catch (error) {
        console.log("카카오 로그인 오류: ", error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: "카카오 로그인 실패",
        });
    }
});
exports.kakao = kakao;
//::구글
const google = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    return res.json({ email: email, password: password });
});
exports.google = google;
