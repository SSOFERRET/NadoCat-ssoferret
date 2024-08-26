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
exports.indexResultToOpensearch = exports.deleteOpensearchDocument = exports.updateOpensearchDocument = exports.updateOpensearchUser = exports.indexOpensearchUser = exports.indexOpensearchDocument = exports.searchDocuments = void 0;
const category_1 = require("../../constants/category");
const search_1 = require("../../constants/search");
const opensearch_1 = __importDefault(require("./../../opensearch"));
const client_1 = __importDefault(require("../../client"));
const community_model_1 = require("../../model/community.model");
const event_model_1 = require("../../model/event.model");
const missing_model_1 = require("../../model/missing.model");
const streetCat_model_1 = require("../../model/streetCat.model");
const getId = (categoryId, postId) => `${categoryId}_${postId}`;
const getDataForSearch = (categoryId, postId) => {
    return {
        categoryName: (0, category_1.getCategoryUrlStringById)(categoryId),
        documentId: getId(categoryId, postId)
    };
};
const searchDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("searchDocuments function called");
    const { query } = req.query;
    try {
        const searchCategoryList = [1, 2, 3, 5].map((id) => (0, category_1.getCategoryUrlStringById)(id));
        const results = yield Promise.all(searchCategoryList.map((categoryName) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log(categoryName)
            try {
                const result = yield opensearch_1.default.search({
                    index: categoryName,
                    body: {
                        track_total_hits: true,
                        query: {
                            bool: {
                                should: [
                                    { match: { content: query } },
                                    { match: { title: query } },
                                    { match: { detail: query } },
                                    { match: { name: query } }
                                    // { match: { nickname: query } }
                                ]
                            }
                        }
                    },
                    size: search_1.SEARCH.SIZE
                });
                return {
                    category: categoryName,
                    search: result.body.hits.hits,
                    totalcount: result.body.hits.total
                };
            }
            catch (_a) {
                console.log(`No ${categoryName}`);
                return;
            }
        })));
        res.status(200).json(results);
    }
    catch (error) {
        console.error('OpenSearch search error:', error);
        res.status(500).send('Error searching documents');
    }
});
exports.searchDocuments = searchDocuments;
// export const indexOpensearchDocument = async (categoryId: TCategoryId, nickname: string, title: string, content: string, postId: number, timestamp: string, profile?: string, image?: string, tag?: string[]) => {
//   try {
//     const { categoryName, documentId } = getDataForSearch(categoryId, postId);
//     const response = await opensearch.index({
//       index: categoryName,
//       id: documentId,
//       body: {
//         nickname,
//         profile,
//         title,
//         content,
//         url: `/boards/${categoryName}/${postId}`,
//         image,
//         tag,
//         timestamp
//       }
//     });
//     console.log('Document indexed:', response);
//   } catch (error) {
//     console.error('Error indexing document:', error);
//   }
// };
const indexOpensearchDocument = (categoryId, postId, post) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName, documentId } = getDataForSearch(categoryId, postId);
        const response = yield opensearch_1.default.index({
            index: categoryName,
            id: documentId,
            body: post
        });
        console.log('Document indexed:', response);
    }
    catch (error) {
        console.error('Error indexing document:', error);
    }
});
exports.indexOpensearchDocument = indexOpensearchDocument;
const indexOpensearchUser = (email, nickname, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield opensearch_1.default.index({
            index: "users",
            id: uuid,
            body: {
                nickname,
                url: `/users/${uuid}/profile`
            }
        });
        console.log('User indexed:', response);
    }
    catch (error) {
        console.error('Error indexing user:', error);
    }
});
exports.indexOpensearchUser = indexOpensearchUser;
const updateOpensearchUser = (nickname, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield opensearch_1.default.update({
            index: "users",
            id: uuid,
            body: {
                doc: {
                    nickname
                }
            }
        });
        console.log('User indexed:', response);
    }
    catch (error) {
        console.error('Error indexing user:', error);
    }
});
exports.updateOpensearchUser = updateOpensearchUser;
const updateOpensearchDocument = (categoryId, postId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName, documentId } = getDataForSearch(categoryId, postId);
        const response = yield opensearch_1.default.update({
            index: categoryName,
            id: documentId,
            body: {
                doc: data
            }
        });
        console.log('Document updated:', response);
    }
    catch (error) {
        console.error('Error updating document:', error);
    }
});
exports.updateOpensearchDocument = updateOpensearchDocument;
const deleteOpensearchDocument = (categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName, documentId } = getDataForSearch(categoryId, postId);
        const response = yield opensearch_1.default.delete({
            index: categoryName,
            id: documentId
        });
        console.log('Document deleted:', response);
    }
    catch (error) {
        console.error('Error deleting document:', error);
    }
});
exports.deleteOpensearchDocument = deleteOpensearchDocument;
const indexResultToOpensearch = (categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let postDataForOpensearch;
        switch (categoryId) {
            case 1:
                postDataForOpensearch = yield (0, community_model_1.getCommunityById)(tx, postId);
                break;
            case 2:
                postDataForOpensearch = yield (0, event_model_1.getEventById)(tx, postId);
                break;
            case 3:
                postDataForOpensearch = yield (0, missing_model_1.getMissingById)(tx, postId);
                break;
            case 5:
                postDataForOpensearch = yield (0, streetCat_model_1.getStreetCatById)(tx, postId);
                console.log(postDataForOpensearch);
                break;
            default:
                throw new Error("유효하지 않은 카테고리 ID");
        }
        if (!postDataForOpensearch)
            throw new Error("포스트 없다");
        yield (0, exports.indexOpensearchDocument)(categoryId, postId, postDataForOpensearch);
    }));
});
exports.indexResultToOpensearch = indexResultToOpensearch;
