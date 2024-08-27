"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryUrlStringById = exports.getCategory = exports.CATEGORY = void 0;
exports.CATEGORY = Object.freeze({
    COMMUNITIES: 1,
    EVENTS: 2,
    MISSINGS: 3,
    MISSING_REPORTS: 4,
    STREET_CATS: 5,
});
const getCategory = (categoryId) => {
    switch (categoryId) {
        case exports.CATEGORY.COMMUNITIES: return "communities";
        case exports.CATEGORY.EVENTS: return "events";
        case exports.CATEGORY.MISSINGS: return "missings";
        case exports.CATEGORY.MISSING_REPORTS: return "missingsReports";
        case exports.CATEGORY.STREET_CATS: return "streetCats";
    }
};
exports.getCategory = getCategory;
const getCategoryUrlString = (category) => category === (0, exports.getCategory)(exports.CATEGORY.STREET_CATS) ? "street-cats" : category;
const getCategoryUrlStringById = (categoryId) => getCategoryUrlString((0, exports.getCategory)(categoryId));
exports.getCategoryUrlStringById = getCategoryUrlStringById;
