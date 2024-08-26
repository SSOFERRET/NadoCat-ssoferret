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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateView = void 0;
const category_1 = require("../../constants/category");
const updateView = (tx, categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const model = (0, category_1.getCategory)(categoryId);
    if (!model)
        throw new Error("부적절한 카테고리");
    return yield tx[model].update({
        where: {
            postId
        },
        data: {
            views: {
                increment: 1
            }
        }
    });
});
exports.updateView = updateView;
