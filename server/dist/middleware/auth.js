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
const ensureAutorization = (req, res, next) => {
    var _a;
    try {
        const token = ((_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.cookies.generalToken;
        if (!token) {
            return res.status(401).json({ message: 'JWT 토큰이 존재하지 않습니다.' });
        }
        const decodedJwt = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY_GEN);
        if (decodedJwt.exp) {
        }
        else {
            console.error("JWT에 만료 시간이 설정되지 않았습니다.");
        }
        const uuid = decodedJwt.uuid;
        req.user = {
            uuid: uuid || decodedJwt.uuid,
            email: decodedJwt.email,
        };
        next();
    }
    catch (error) {
        console.error("Authorization error:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json({
                message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
            });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
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
