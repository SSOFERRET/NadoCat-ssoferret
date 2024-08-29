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
const updateView = (tx, categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (categoryId) {
            case 1: return yield tx.communities.update({
                where: {
                    postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            case 2: return yield tx.events.update({
                where: {
                    postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            case 3: return yield tx.missings.update({
                where: {
                    postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            case 5: return yield tx.streetCats.update({
                where: {
                    postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateView = updateView;
