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
exports.kakaoUser = exports.logoutUser = exports.refreshAccessToken = exports.saveRefreshToken = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const redis_1 = __importDefault(require("../redis"));
const prisma = new client_1.PrismaClient();
const createUser = (email, nickname, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashing = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const saltRound = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRound);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        return { salt, hashPassword };
    });
    const { salt, hashPassword } = yield hashing(password);
    const uuid = (0, uuid_1.v4)();
    const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
    try {
        const selectUser = yield prisma.users.findFirst({
            where: {
                email: email,
            },
        });
        if (selectUser && selectUser.status === "active") {
            return null;
        }
        const result = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.users.create({
                data: {
                    uuid: uuidBuffer,
                    email: email,
                    profileImage: "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png",
                    nickname: nickname,
                    authType: "general",
                    status: "active",
                },
            });
            const secretUser = yield prisma.userSecrets.create({
                data: {
                    uuid: uuidBuffer,
                    hashPassword: hashPassword,
                    salt: salt,
                },
            });
            return { user, secretUser };
        }));
        return result;
    }
    catch (error) {
        console.error("회원가입 error:", error);
        throw new Error("회원가입 중 오류 발생");
    }
});
exports.createUser = createUser;
const loginUser = (email, password, autoLogin) => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = yield (0, redis_1.default)();
    try {
        const result = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const selectUser = yield prisma.users.findFirst({
                where: {
                    email: email,
                },
            });
            if (!selectUser || selectUser.status === "inactive") {
                throw { status: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: "사용자를 찾을 수 없습니다." };
            }
            if (selectUser.authType === "kakao") {
                return { selectUser, selectUserSecret: null };
            }
            const userUuid = selectUser.uuid;
            const selectUserSecret = yield prisma.userSecrets.findFirst({
                where: {
                    uuid: userUuid,
                },
            });
            if (!selectUserSecret) {
                throw { status: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: "사용자를 찾을 수 없습니다." };
            }
            return { selectUser, selectUserSecret };
        }));
        if (!result) {
            throw { status: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: "사용자를 찾을 수 없습니다." };
        }
        const { selectUser, selectUserSecret } = result;
        if (selectUser.authType === "general") {
            if (!selectUserSecret || !selectUserSecret.hashPassword) {
                throw new Error("비밀번호가 설정되지 않은 사용자입니다.");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, selectUserSecret.hashPassword);
            if (!isPasswordValid) {
                throw new Error("사용자 정보가 일치하지 않습니다.");
            }
        }
        const userUuidString = selectUser.uuid.toString("hex");
        const generalToken = jsonwebtoken_1.default.sign({
            uuid: userUuidString,
            email: selectUser.email
        }, process.env.PRIVATE_KEY_GEN, {
            expiresIn: process.env.GENERAL_TOKEN_EXPIRE_IN,
            issuer: "fefive"
        });
        let refreshToken = null;
        if (autoLogin === true) {
            refreshToken = jsonwebtoken_1.default.sign({
                uuid: userUuidString,
            }, process.env.PRIVATE_KEY_REF, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
                issuer: "fefive"
            });
        }
        yield redisClient.set(`uuid:${userUuidString}`, JSON.stringify({ autoLogin: false }), { EX: 3600 * 8 }); //8시간
        return { generalToken, refreshToken, result, userUuidString };
    }
    catch (error) {
        console.error("로그인 error:", error);
        throw new Error("로그인 중 오류 발생");
    }
});
exports.loginUser = loginUser;
const saveRefreshToken = (uuid, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = yield (0, redis_1.default)();
    try {
        const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
        const selectUserSecrets = yield prisma.userSecrets.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        const updateSecretUser = yield prisma.userSecrets.update({
            data: {
                refreshToken: refreshToken
            },
            where: {
                userSecretId: selectUserSecrets === null || selectUserSecrets === void 0 ? void 0 : selectUserSecrets.userSecretId,
            },
        });
        yield redisClient.set(`uuid:${uuidBuffer.toString("hex")}`, JSON.stringify({ autoLogin: true }), { EX: 7 * 24 * 60 * 60 });
        return { selectUserSecrets, updateSecretUser };
    }
    catch (error) {
        console.error("자동로그인 error:", error);
        throw new Error("자동로그인 중 오류 발생");
    }
});
exports.saveRefreshToken = saveRefreshToken;
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.PRIVATE_KEY_REF);
        const uuidBuffer = Buffer.from(decoded.uuid.replace(/-/g, ""), "hex");
        const selectUser = yield prisma.users.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        const selectUserSecrets = yield prisma.userSecrets.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        if (!selectUser) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }
        if (!selectUserSecrets) {
            throw new Error("유효하지 않은 사용자입니다.");
        }
        const newAccessToken = jsonwebtoken_1.default.sign({
            uuid: decoded.uuid,
            email: selectUser.email
        }, process.env.PRIVATE_KEY_GEN, {
            expiresIn: process.env.GENERAL_TOKEN_EXPIRE_IN,
            issuer: "fefive"
        });
        return newAccessToken;
    }
    catch (error) {
        console.error("access token refresh error:", error);
        throw new Error("access token refresh 중 오류 발생");
    }
});
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisClient = yield (0, redis_1.default)();
        const uuidBuffer = Buffer.from(uuid, "hex");
        yield redisClient.del(`uuid:${uuidBuffer.toString("hex")}`);
        yield redisClient.del(`autoLogin:${uuidBuffer.toString("hex")}`);
        const selectUserSecrets = yield prisma.userSecrets.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });
        if (!selectUserSecrets) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }
        const updateUserSecrets = yield prisma.userSecrets.update({
            data: {
                refreshToken: ""
            },
            where: {
                userSecretId: selectUserSecrets === null || selectUserSecrets === void 0 ? void 0 : selectUserSecrets.userSecretId,
            },
        });
    }
    catch (error) {
        throw new Error("로그아웃 중 오류 발생");
    }
});
exports.logoutUser = logoutUser;
//[x] 카카오 로그인
const kakaoUser = (email, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = yield (0, redis_1.default)();
    try {
        const result = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const selectUser = yield prisma.users.findFirst({
                where: {
                    email: email
                }
            });
            if (!selectUser) {
                const uuid = (0, uuid_1.v4)();
                const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
                const createUser = yield prisma.users.create({
                    data: {
                        uuid: uuidBuffer,
                        email: email,
                        nickname: nickname,
                        authType: "kakao",
                        status: "active",
                    },
                });
                const createUserSecret = yield prisma.userSecrets.create({
                    data: {
                        uuid: uuidBuffer,
                        hashPassword: null,
                        salt: null
                    },
                });
                yield redisClient.set(`uuid:${uuidBuffer.toString("hex")}`, JSON.stringify({ autoLogin: true }), { EX: 7 * 24 * 60 * 60 });
                return { createUser, createUserSecret };
            }
            const userUuidString = selectUser.uuid.toString("hex");
            const generalToken = jsonwebtoken_1.default.sign({
                uuid: userUuidString,
                email: selectUser.email
            }, process.env.PRIVATE_KEY_GEN, {
                expiresIn: process.env.GENERAL_TOKEN_EXPIRE_IN,
                issuer: "fefive"
            });
            yield redisClient.set(`uuid:${userUuidString}`, JSON.stringify({ autoLogin: true }), { EX: 7 * 24 * 60 * 60 });
            let refreshToken = null;
            const selectUserSecrets = yield prisma.userSecrets.findFirst({
                where: {
                    uuid: selectUser.uuid
                }
            });
            if (selectUserSecrets) {
                refreshToken = jsonwebtoken_1.default.sign({
                    uuid: userUuidString,
                }, process.env.PRIVATE_KEY_REF, {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
                    issuer: "fefive"
                });
                yield prisma.userSecrets.update({
                    data: {
                        refreshToken: refreshToken
                    },
                    where: {
                        userSecretId: selectUserSecrets.userSecretId,
                    },
                });
            }
            return { generalToken, refreshToken, nickname: selectUser.nickname, uuid: selectUser.uuid };
        }));
        return result;
    }
    catch (error) {
        console.error("카카오로그인 error:", error);
        throw new Error("카카오로그인 중 오류 발생");
    }
    finally {
        yield redisClient.quit();
    }
});
exports.kakaoUser = kakaoUser;
