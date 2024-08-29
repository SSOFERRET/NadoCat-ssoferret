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
exports.incrementViewCountAsAllowed = void 0;
const redis_1 = __importDefault(require("../../redis"));
const timestamp_1 = require("../../util/time/timestamp");
const view_model_1 = require("../../model/common/view.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const VIEW_LIMIT_SEC = 21600; // 6시간
const incrementViewCountAsAllowed = (req, tx, categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const userIp = req.ip;
    const key = getKeyName(categoryId, postId);
    const field = getFieldName(userIp);
    const redis = yield (0, redis_1.default)();
    if (!Number(process.env.REDIS_VIEW))
        return;
    try {
        const isIncrementAllowed = yield isViewIncrementAllowed(redis, key, field);
        if (isIncrementAllowed) {
            yield (0, view_model_1.updateView)(tx, categoryId, postId);
            return yield redis.hSet(key, field, (0, timestamp_1.getTimestamp)());
        }
    }
    catch (error) {
        throw new Error("incrementViewCountAsAllowed Error");
    }
});
exports.incrementViewCountAsAllowed = incrementViewCountAsAllowed;
const getKeyName = (categoryId, postId) => `views_${categoryId}_${postId}`;
const getFieldName = (userIp) => `userIp_${userIp}`;
const isViewIncrementAllowed = (redis, key, field) => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = (0, timestamp_1.getTimestamp)();
    try {
        const viewCheck = yield checkView(redis, key, field);
        if (!viewCheck)
            return true;
        return timestamp - (yield getLastViewTime(redis, key, field)) > VIEW_LIMIT_SEC;
    }
    catch (error) {
        throw new Error("isViewIncrementAllowed Error");
    }
});
const checkView = (redis, key, field) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis.hExists(key, field);
});
const getLastViewTime = (redis, key, field) => __awaiter(void 0, void 0, void 0, function* () {
    const stringData = yield redis.hGet(key, field);
    return Number(stringData);
});
