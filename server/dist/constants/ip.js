"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.SERVER_URL = exports.PORT = exports.IP = void 0;
exports.IP = process.env.EC2_IP || "http://localhost";
exports.PORT = process.env.PORT || 8080;
exports.SERVER_URL = `${exports.IP}:${exports.PORT}`;
exports.FRONTEND_URL = process.env.EC2_IP || process.env.CORS_ALLOW_ORIGIN || "http://localhost:5173";
