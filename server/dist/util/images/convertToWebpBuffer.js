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
exports.convertToWebpBuffer = void 0;
const sharp_1 = __importDefault(require("sharp"));
const RESIZE_WIDTH = 1080;
const MAXIMUM_MB = 1 * 1024 * 1024;
const QUALITY_DEGREE = 5;
const convertToWebpBuffer = (data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, quality = 90) {
    try {
        if (quality <= 30)
            throw new Error("quality must be > 30");
        const image = (0, sharp_1.default)(data.buffer);
        const width = yield image.metadata().then((metadata) => {
            if (!metadata.width)
                throw new Error("where is image width??");
            return metadata.width;
        });
        const webpBuffer = yield image.resize(width > RESIZE_WIDTH ? RESIZE_WIDTH : null).webp({ quality }).toBuffer();
        if (webpBuffer.byteLength > MAXIMUM_MB) {
            const reduceQuality = quality - QUALITY_DEGREE;
            return yield (0, exports.convertToWebpBuffer)(data, reduceQuality);
        }
        return webpBuffer;
    }
    catch (error) {
        throw error;
    }
});
exports.convertToWebpBuffer = convertToWebpBuffer;
