"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Searches_1 = require("../controller/search/Searches");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.get("", Searches_1.searchDocuments);
exports.default = router;
