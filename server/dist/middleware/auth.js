"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAutorization = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//[x]jwt 복호화
const ensureAutorization = (req, res, next) => {
    var _a;
    try {
        console.log("미들웨어 시작!!!!");
        //쿠키에서 jwt가져오기
        const token = req.cookies.generalToken || ((_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        console.log("cookie token: ", token);
        if (!token) {
            return res.status(401).json({ message: 'JWT 토큰이 존재하지 않습니다.' });
        }
        const decodedJwt = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY_GEN);
        // JWT 만료 시간 확인
        if (decodedJwt.exp) {
            console.log("JWT 만료 시간:", new Date(decodedJwt.exp * 1000));
        }
        else {
            console.error("JWT에 만료 시간이 설정되지 않았습니다.");
        }
        // 요청 헤더에서 uuid 가져오기
        const uuid = req.headers["x-uuid"];
        req.user = {
            uuid: uuid || decodedJwt.uuid,
            email: decodedJwt.email,
        };
        next();
    }
    catch (error) {
        console.error("Authorization error:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.log("TokenExpiredError 발생!");
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json({
                message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
            });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log("JsonWebTokenError 발생!");
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ message: "잘못된 토큰입니다." });
        }
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "서버 오류가 발생했습니다." });
    }
};
exports.ensureAutorization = ensureAutorization;
