"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const opensearch_1 = require("@opensearch-project/opensearch");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const opensearch = new opensearch_1.Client({
    node: process.env.OPENSEARCH_URL,
    auth: {
        username: process.env.OPENSEARCH_USERNAME,
        password: process.env.OPENSEARCH_PASSWORD,
    },
    ssl: {
        rejectUnauthorized: false
    }
});
exports.default = opensearch;
