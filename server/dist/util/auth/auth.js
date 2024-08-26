"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//[x]jwt 복호화
const ensureAutorization = (req, res) => {
    try {
        const auth = req.headers["authorization"];
        console.log("auth: ", auth);
        if (auth) {
            const decodedJwt = jsonwebtoken_1.default.verify(auth, process.env.PRIVATE_KEY);
            console.log("decodedJwt: ", decodedJwt);
            return decodedJwt;
        }
        else if (auth && auth.startsWith("Bearer ")) {
            const receivedJwt = auth.substring(7);
            console.log("receivedJwt: ", receivedJwt);
            const decodedJwt = jsonwebtoken_1.default.verify(receivedJwt, process.env.PRIVATE_KEY);
            console.log("decodedJwt: ", decodedJwt);
            return decodedJwt;
        }
        else {
            throw new ReferenceError("잘못된 jwt 형식입니다.");
        }
    }
    catch (error) {
        return error;
    }
};
exports.default = ensureAutorization;
