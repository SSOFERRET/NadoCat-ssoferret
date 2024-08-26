"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderBy = void 0;
const getOrderBy = (sort) => {
    switch (sort) {
        case "latest":
            return { sortBy: "createdAt", sortOrder: "desc" };
        case "views":
            return { sortBy: "views", sortOrder: "desc" };
        case "likes":
            return { sortBy: "likes", sortOrder: "desc" };
        default:
            throw new Error("일치하는 정렬 기준이 없습니다.");
    }
};
exports.getOrderBy = getOrderBy;
