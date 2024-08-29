"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = void 0;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const handleControllerError = (error, res) => {
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025" || error.code === "P2003") {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "해당 정보를 찾을 수 없습니다." });
        }
    }
    res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
};
exports.handleControllerError = handleControllerError;
