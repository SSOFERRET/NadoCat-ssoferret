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
exports.interest = void 0;
const client_1 = __importDefault(require("../client"));
// const findPostInCategory = async (category: PostCategory, postId: number) => {
//   switch (category) {
//     case "communities":
//       return await prisma.communities.findUnique({
//         where: { postId: postId },
//         select: { title: true, content: true, views: true, createdAt: true, thumbnail: true }
//       });
//     case "events":
//       return await prisma.events.findUnique({
//         where: { postId: postId },
//         select: { title: true, content: true, views: true, createdAt: true, thumbnail: true, isClosed: true }
//       });
//     default:
//       return null;
//   }
// };
const findPostInCategory = (category, postId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let data;
    switch (category) {
        case "communities":
            data = yield client_1.default.communities.findUnique({
                where: { postId: postId },
                select: {
                    title: true,
                    content: true,
                    views: true,
                    createdAt: true,
                    communityImages: {
                        select: {
                            images: {
                                select: {
                                    imageId: true,
                                    url: true,
                                },
                            },
                        },
                    },
                },
            });
            return {
                title: data === null || data === void 0 ? void 0 : data.title,
                content: data === null || data === void 0 ? void 0 : data.content,
                views: data === null || data === void 0 ? void 0 : data.views,
                createdAt: data === null || data === void 0 ? void 0 : data.createdAt,
                thumbnail: (_a = data === null || data === void 0 ? void 0 : data.communityImages.map((item) => item.images.url).join("")) !== null && _a !== void 0 ? _a : null,
            };
        case "events":
            data = yield client_1.default.events.findUnique({
                where: { postId: postId },
                select: {
                    title: true,
                    content: true,
                    views: true,
                    createdAt: true,
                    eventImages: {
                        select: {
                            images: {
                                select: {
                                    imageId: true,
                                    url: true,
                                },
                            },
                        },
                    },
                },
            });
            return {
                title: data === null || data === void 0 ? void 0 : data.title,
                content: data === null || data === void 0 ? void 0 : data.content,
                views: data === null || data === void 0 ? void 0 : data.views,
                createdAt: data === null || data === void 0 ? void 0 : data.createdAt,
                thumbnail: (_b = data === null || data === void 0 ? void 0 : data.eventImages.map((item) => item.images.url).join("")) !== null && _b !== void 0 ? _b : null,
            };
        default:
            return null;
    }
});
const interest = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const interestPosts = yield client_1.default.likes.findMany({
        where: {
            uuid: uuid,
        },
        select: {
            postId: true,
            categoryId: true,
        },
    });
    const categories = yield client_1.default.boardCategories.findMany({
        where: {
            categoryId: {
                in: interestPosts.map((post) => post.categoryId),
            },
        },
        select: {
            categoryId: true,
            category: true,
        },
    });
    const categoryMap = new Map(categories.map((cat) => [cat.categoryId, cat.category]));
    const posts = yield Promise.all(interestPosts.map((interestPost) => __awaiter(void 0, void 0, void 0, function* () {
        const category = categoryMap.get(interestPost.categoryId);
        if (!category) {
            return null;
        }
        return yield findPostInCategory(category, interestPost.postId);
    })));
    return posts.filter((post) => post !== null);
});
exports.interest = interest;
