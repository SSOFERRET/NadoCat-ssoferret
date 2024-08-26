"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestamp = void 0;
const date_1 = require("../../constants/date");
const getTimestamp = () => Math.floor(Date.now() / 1000) - date_1.DATE.BASETIME;
exports.getTimestamp = getTimestamp;
