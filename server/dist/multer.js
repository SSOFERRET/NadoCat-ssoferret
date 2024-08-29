"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
//req에 이미지 정보 입력해주는 미들웨어 
const storage = multer_1.default.memoryStorage();
const uploadImages = (0, multer_1.default)({ storage });
exports.default = uploadImages;
