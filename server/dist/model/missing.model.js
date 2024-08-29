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
exports.deleteMissingCat = exports.updateMissingReportCheckByPostId = exports.updateFoundByPostId = exports.updateMissingReportByPostId = exports.updateMissingCatByCat = exports.updateMissingByPostId = exports.addMissingReport = exports.getMissingReportsByMissingId = exports.getImageFormatsByPostId = exports.getReportCount = exports.getLocationFormatsByPostId = exports.getMissingById = exports.getPostByPostId = exports.deleteLocationFormats = exports.removeImagesByIds = exports.deleteImageFormats = exports.addLocationFormats = exports.addImageFormats = exports.removePost = exports.getPostsCount = exports.getPostList = exports.addMissingCat = exports.addMissing = void 0;
const client_1 = __importDefault(require("../client"));
const model_model_1 = require("./common/model.model");
const missingDataSelect = {
    postId: true,
    uuid: false,
    categoryId: false,
    catId: false,
    time: true,
    locationId: false,
    found: true,
    views: true,
    createdAt: true,
    updatedAt: true,
    users: {
        select: {
            nickname: true,
            profileImage: true,
            uuid: true,
            id: true
        }
    },
    missingCats: {
        select: {
            missingCatId: true,
            name: true,
            birth: true,
            detail: true,
            gender: true
        }
    },
    locations: {
        select: {
            locationId: true,
            latitude: true,
            longitude: true,
            detail: true
        }
    }
};
const missingReportDataSelect = {
    postId: true,
    uuid: false,
    categoryId: false,
    missingId: true,
    time: true,
    locationId: false,
    match: true,
    views: true,
    createdAt: true,
    updatedAt: true,
    users: {
        select: {
            nickname: true,
            profileImage: true,
            uuid: true,
            id: true
        }
    },
    locations: {
        select: {
            locationId: true,
            latitude: true,
            longitude: true,
            detail: true
        }
    }
};
const addMissing = (tx, missing) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missings.create({
        data: missing,
    });
});
exports.addMissing = addMissing;
const addMissingCat = (tx, cat) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingCats.create({
        data: Object.assign(Object.assign({}, cat), { birth: new Date(cat.birth) }),
    });
});
exports.addMissingCat = addMissingCat;
const getPostList = (listData, missingId) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = listData;
    switch (categoryId) {
        case 3: return yield getMissingsList(listData);
        case 4: return yield getMissingReportsList(listData, missingId);
    }
});
exports.getPostList = getPostList;
const getMissingsList = (listData) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, cursor, orderBy } = listData;
    const fetchMissingsByFoundStatus = (foundStatus, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
        return yield client_1.default.missings.findMany({
            where: {
                found: foundStatus,
            },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { postId: cursor } : undefined,
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    postId: "desc",
                },
            ],
            select: missingDataSelect
        });
    });
    const unfoundList = yield fetchMissingsByFoundStatus(0, limit, cursor);
    const remainingLimit = limit - unfoundList.length;
    let foundList = remainingLimit > 0 ? yield fetchMissingsByFoundStatus(1, remainingLimit, cursor) : [];
    const posts = [...unfoundList, ...foundList];
    const userIds = posts.map((post) => post.users.uuid.toString("hex"));
    return [posts, userIds];
});
const getMissingReportsList = (listData, missingId) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, cursor, orderBy } = listData;
    const fetchMissingReportsByFoundStatus = (matchStatus, missingId, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
        return yield client_1.default.missingReports.findMany({
            where: {
                missingId,
                match: matchStatus
            },
            select: missingReportDataSelect,
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { postId: cursor } : undefined,
            orderBy: [
                {
                    [orderBy.sortBy]: orderBy.sortOrder,
                },
                {
                    postId: "desc",
                },
            ],
        });
    });
    const matchList = yield fetchMissingReportsByFoundStatus("Y", missingId, limit, cursor);
    let remainingLimit = limit - matchList.length;
    const checkingList = remainingLimit > 0 ? yield fetchMissingReportsByFoundStatus("-", missingId, remainingLimit, cursor) : [];
    let posts = [...matchList, ...checkingList];
    remainingLimit = limit - posts.length;
    const unmatchList = yield fetchMissingReportsByFoundStatus("N", missingId, limit, cursor);
    posts = [...posts, ...unmatchList];
    const userIds = posts.map((post) => post.users.uuid.toString("hex"));
    return [posts, userIds];
});
const getPostsCount = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    switch (categoryId) {
        case 3: return yield client_1.default.missings.count();
        case 4: return yield client_1.default.missingReports.count();
        default: return new Error("잘못된 카테고리 ID");
    }
});
exports.getPostsCount = getPostsCount;
const removePost = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    const model = (0, model_model_1.getCategoryModel)(postData.categoryId);
    if (model) {
        return yield tx[model].delete({
            where: {
                postId: postData.postId,
                categoryId: postData.categoryId,
            },
        });
    }
});
exports.removePost = removePost;
const addImageFormats = (tx, categoryId, images) => __awaiter(void 0, void 0, void 0, function* () {
    switch (categoryId) {
        case 3:
            return yield tx.missingImages.createMany({
                data: images,
            });
        case 4:
            return yield tx.missingReportImages.createMany({
                data: images,
            });
    }
});
exports.addImageFormats = addImageFormats;
const addLocationFormats = (tx, categoryId, location) => __awaiter(void 0, void 0, void 0, function* () {
    switch (categoryId) {
        case 3:
            return yield tx.missingLocations.create({
                data: location,
            });
        case 4:
            return yield tx.missingReportLocations.create({
                data: location,
            });
    }
});
exports.addLocationFormats = addLocationFormats;
const deleteImageFormats = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    switch (postData.categoryId) {
        case 3:
            return yield tx.missingImages.deleteMany({
                where: {
                    postId: postData.postId,
                },
            });
        case 4:
            return yield tx.missingReportImages.deleteMany({
                where: {
                    postId: postData.postId,
                },
            });
    }
});
exports.deleteImageFormats = deleteImageFormats;
const removeImagesByIds = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingImages.deleteMany({
        where: {
            imageId: {
                in: imageIds,
            },
        },
    });
});
exports.removeImagesByIds = removeImagesByIds;
const deleteLocationFormats = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    switch (postData.categoryId) {
        case 3:
            return yield tx.missingLocations.deleteMany({
                where: {
                    postId: postData.postId,
                },
            });
        case 4:
            return yield tx.missingReportLocations.deleteMany({
                where: {
                    postId: postData.postId,
                },
            });
    }
});
exports.deleteLocationFormats = deleteLocationFormats;
const getPostByPostId = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    switch (postData.categoryId) {
        case 3:
            return yield tx.missings.findUnique({
                where: {
                    postId: postData.postId,
                },
                select: Object.assign(Object.assign({}, missingDataSelect), { detail: true })
            });
        case 4:
            return yield tx.missingReports.findUnique({
                where: {
                    postId: postData.postId,
                },
            });
    }
});
exports.getPostByPostId = getPostByPostId;
const getMissingById = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missings.findUnique({
        where: {
            postId: postId,
        }
    });
});
exports.getMissingById = getMissingById;
const getLocationFormatsByPostId = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    switch (postData.categoryId) {
        case 3:
            return yield tx.missingLocations.findMany({
                where: {
                    postId: postData.postId,
                },
            });
        case 4:
            return yield tx.missingReportLocations.findMany({
                where: {
                    postId: postData.postId,
                },
            });
    }
});
exports.getLocationFormatsByPostId = getLocationFormatsByPostId;
const getReportCount = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.missingReports.count({
        where: {
            missingId: postId
        }
    });
});
exports.getReportCount = getReportCount;
const getImageFormatsByPostId = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    switch (postData.categoryId) {
        case 3:
            return yield tx.missingImages.findMany({
                where: {
                    postId: postData.postId,
                },
            });
        case 4:
            return yield tx.missingReportImages.findMany({
                where: {
                    postId: postData.postId,
                },
            });
    }
});
exports.getImageFormatsByPostId = getImageFormatsByPostId;
const getMissingReportsByMissingId = (tx, missingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingReports.findMany({
        where: {
            missingId,
        },
    });
});
exports.getMissingReportsByMissingId = getMissingReportsByMissingId;
const addMissingReport = (tx, missingReport) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingReports.create({
        data: missingReport,
    });
});
exports.addMissingReport = addMissingReport;
const updateMissingByPostId = (tx, postId, uuid, missing) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missings.update({
        where: {
            postId,
            uuid,
        },
        data: {
            time: new Date(missing.time),
            detail: missing.detail
        },
    });
});
exports.updateMissingByPostId = updateMissingByPostId;
const updateMissingCatByCat = (tx, catId, cat) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingCats.update({
        where: {
            missingCatId: catId
        },
        data: Object.assign(Object.assign({}, cat), { birth: new Date(cat.birth) }),
    });
});
exports.updateMissingCatByCat = updateMissingCatByCat;
const updateMissingReportByPostId = (tx, postId, uuid, detail, time) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingReports.update({
        where: {
            postId,
            uuid,
        },
        data: {
            time,
            detail,
        },
    });
});
exports.updateMissingReportByPostId = updateMissingReportByPostId;
const updateFoundByPostId = (tx, postData, found) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missings.update({
        where: {
            uuid: postData.userId,
            postId: postData.postId,
        },
        data: {
            found: Number(found),
        },
    });
});
exports.updateFoundByPostId = updateFoundByPostId;
const updateMissingReportCheckByPostId = (tx, postData, match) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingReports.update({
        where: {
            // uuid: postData.userId,
            postId: postData.postId,
        },
        data: {
            match,
        },
    });
});
exports.updateMissingReportCheckByPostId = updateMissingReportCheckByPostId;
const deleteMissingCat = (tx, catId, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.missingCats.delete({
        where: {
            missingCatId: catId,
            uuid
        }
    });
});
exports.deleteMissingCat = deleteMissingCat;
