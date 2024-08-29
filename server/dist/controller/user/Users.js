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
exports.getUuid = exports.storeLoginData = exports.kakao = exports.logout = exports.getNewAccessToken = exports.login = exports.signup = void 0;
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const user_model_1 = require("../../model/user.model");
const redis_1 = __importDefault(require("../../redis"));
dotenv_1.default.config();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nickname, password } = req.body;
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
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, autoLogin } = req.body;
    const isAutoLogin = (autoLogin === 'true' || autoLogin === true);
    const generalTokenMaxAge = parseInt(process.env.GENERAL_TOKEN_MAX_AGE || '28800000'); // 8시간
    const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000"); // 7일
    // const generalTokenMaxAge = 1 * 60 * 1000; // 1분
    // const refreshTokenMaxAge = 3 * 60 * 1000;// 3분
    // const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;// 7일
    try {
        const { generalToken, refreshToken, result, userUuidString } = yield (0, user_model_1.loginUser)(email, password, autoLogin);
        if (!userUuidString || (!refreshToken && autoLogin)) {
            throw new Error("유효하지 않은 값입니다.");
        }
        res.cookie("generalToken", generalToken, {
            httpOnly: true,
            secure: true,
            maxAge: generalTokenMaxAge,
        });
        if (isAutoLogin) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: refreshTokenMaxAge,
            });
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
        console.error("로그인 error:", error);
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "로그인 처리 중 오류가 발생했습니다." });
    }
});
exports.login = login;
const getNewAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Refresh token이 존재하지 않습니다." });
    }
    try {
        const newAccessToken = yield (0, user_model_1.refreshAccessToken)(refreshToken);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error("로그인 error:", error);
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "유효하지 않은 Refresh token입니다." });
    }
});
exports.getNewAccessToken = getNewAccessToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.body;
        if (!uuid) {
            return res.status(400).json({ message: "UUID가 없습니다." });
        }
        yield (0, user_model_1.logoutUser)(uuid);
        res.clearCookie("generalToken", { httpOnly: true, secure: true });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.clearCookie("uuid", { httpOnly: true, secure: true });
        return res.status(200).json({ message: "로그아웃 성공" });
    }
    catch (error) {
        console.error("로그아웃 에러:", error);
        return res.status(500).json({ message: "로그아웃 중 오류 발생" });
    }
});
exports.logout = logout;
//[ ]카카오
const kakao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const generalTokenMaxAge = 30 * 60 * 1000; // 30분
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7일
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
        const { access_token } = tokenResponse.data;
        const userResponse = yield axios_1.default.get(process.env.KAKAO_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { properties, kakao_account } = userResponse.data;
        const kakaoEmail = kakao_account.email;
        const kakaoNickname = properties.nickname;
        const result = yield (0, user_model_1.kakaoUser)(kakaoEmail, kakaoNickname);
        if (!result || !result.uuid) {
            throw new Error("유효하지 않은 사용자입니다.");
        }
        const userUuidString = result.uuid.toString("hex");
        res.cookie("generalToken", result.generalToken, {
            httpOnly: true,
            secure: true,
            maxAge: generalTokenMaxAge,
        });
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: refreshTokenMaxAge,
        });
        // res.redirect(`http://localhost:5173/users/auth/kakao-redirect?code=${code}&uuid=${userUuidString}`);
        res.redirect(`http://3.37.238.147/users/auth/kakao-redirect?code=${code}&uuid=${userUuidString}`);
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: "카카오 로그인 실패",
            error: error,
        });
    }
});
exports.kakao = kakao;
const storeLoginData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid, isAutoLogin } = req.body;
    const redisClient = yield (0, redis_1.default)();
    try {
        yield redisClient.set(`uuid:${uuid}`, JSON.stringify({ isAutoLogin }), {
            EX: isAutoLogin ? 7 * 24 * 60 * 60 : 8 * 60 * 60,
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "데이터 저장 성공",
            uuid: uuid
        });
    }
    catch (error) {
        console.error("Redis 데이터 저장 중 오류 발생:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    }
});
exports.storeLoginData = storeLoginData;
const getUuid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const redisClient = yield (0, redis_1.default)();
    const uuidKey = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        console.log(`Fetching uuid with key: uuid:${uuidKey}`);
        const uuidData = yield redisClient.get(`uuid:${uuidKey}`);
        if (!uuidData) {
            console.log("UUID를 찾을 수 없습니다.");
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "UUID를 찾을 수 없습니다." });
        }
        console.log(`Fetched uuid data: ${uuidData}`);
        const uuid = JSON.parse(uuidData).uuid;
        return res.status(http_status_codes_1.StatusCodes.OK).json({ uuid: uuid });
    }
    catch (error) {
        console.error("Redis 데이터 저장 중 오류 발생:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    }
    finally {
        redisClient.quit();
    }
});
exports.getUuid = getUuid;
