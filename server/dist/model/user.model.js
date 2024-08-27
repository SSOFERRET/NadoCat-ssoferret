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
const Searches_1 = require("../controller/search/Searches");
const prisma = new client_1.PrismaClient();
//[x]회원가입
const createUser = (email, nickname, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashing = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const saltRound = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRound);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        return { salt, hashPassword };
    });
    const { salt, hashPassword } = yield hashing(password);
    const uuid = (0, uuid_1.v4)();
    console.log("uuid원형: ", uuid);
    console.log("uuid하이픈제거: ", uuid.replace(/-/g, ""));
    const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
    try {
        //중복 사용자 검증
        const selectUser = yield prisma.users.findFirst({
            where: {
                email: email,
            },
        });
        if (selectUser && selectUser.status === "active") {
            console.log("사용중인 이메일입니다.");
            return null;
        }
        //새로 가입
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
            yield (0, Searches_1.indexOpensearchUser)(email, nickname, uuidBuffer.toString("hex"));
            return { user, secretUser };
        }));
        return result;
    }
    catch (error) {
        console.log("회원가입 error:", error);
        throw new Error("회원가입 중 오류 발생");
    }
});
exports.createUser = createUser;
//[x]로그인
const loginUser = (email, password, autoLogin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const selectUser = yield prisma.users.findFirst({
                where: {
                    email: email,
                },
            });
            if (!selectUser || selectUser.status === "inactive") {
                console.log("사용자를 찾을 수 없습니다.");
                return null;
            }
            const userUuid = selectUser.uuid;
            const selectUserSecret = yield prisma.userSecrets.findFirst({
                where: {
                    uuid: userUuid,
                },
            });
            if (!selectUserSecret) {
                console.log("사용자를 찾을 수 없습니다.");
                return null;
            }
            return { selectUser, selectUserSecret };
        }));
        if (!result) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }
        const { selectUser, selectUserSecret } = result;
        const isPasswordValid = yield bcrypt_1.default.compare(password, selectUserSecret.hashPassword);
        if (!isPasswordValid) {
            throw new Error("사용자 정보가 일치하지 않습니다.");
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
        if (autoLogin) {
            refreshToken = jsonwebtoken_1.default.sign({
                uuid: userUuidString,
            }, process.env.PRIVATE_KEY_REF, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
                issuer: "fefive"
            });
            console.log("refreshToken왜 안나오냐:", refreshToken);
        }
        return { generalToken, refreshToken, result, userUuidString };
    }
    catch (error) {
        console.log("로그인 error:", error);
        throw new Error("로그인 중 오류 발생");
    }
});
exports.loginUser = loginUser;
//[x] 자동로그인(리프레시 토큰)
const saveRefreshToken = (uuid, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
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
        return { selectUserSecrets, updateSecretUser };
    }
    catch (error) {
        console.log("자동로그인 error:", error);
        throw new Error("자동로그인 중 오류 발생");
    }
});
exports.saveRefreshToken = saveRefreshToken;
//[x] 리프레시 토큰을 통한 액세스 토큰 발급
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //토큰 검증
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.PRIVATE_KEY_REF);
        //사용자 정보 가져옴
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
        //access token재발급
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
        console.log("access token refresh error:", error);
        throw new Error("access token refresh 중 오류 발생");
    }
});
exports.refreshAccessToken = refreshAccessToken;
//[ ] 로그아웃
const logoutUser = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuidBuffer = Buffer.from(uuid, "hex");
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
        return console.log("로그아웃 성공");
    }
    catch (error) {
        console.log("로그아웃:", error);
        throw new Error("로그아웃 중 오류 발생");
    }
});
exports.logoutUser = logoutUser;
//[ ] 카카오 로그인
const kakaoUser = (email, nickname, accessToken, refreshToken, tokenExpiry) => __awaiter(void 0, void 0, void 0, function* () {
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
                const createUserOauthSecret = yield prisma.userOauthSecrets.create({
                    data: {
                        uuid: uuidBuffer,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        tokenExpiry: tokenExpiry,
                    },
                });
                return { createUser, createUserOauthSecret };
            }
            return selectUser;
        }));
        return result;
    }
    catch (error) {
        console.log("카카오로그인 error:", error);
        throw new Error("카카오로그인 중 오류 발생");
    }
});
exports.kakaoUser = kakaoUser;
