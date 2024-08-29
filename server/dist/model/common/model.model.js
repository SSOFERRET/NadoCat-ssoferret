"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryModel = exports.modelMap = void 0;
const category_1 = require("../../constants/category");
const createModelMap = () => {
    const map = {};
    for (let i = 1; i <= 5; i++) {
        map[i] = (0, category_1.getCategory)(i);
    }
    return map;
};
exports.modelMap = createModelMap();
const getCategoryModel = (categoryId) => exports.modelMap[categoryId];
exports.getCategoryModel = getCategoryModel;
