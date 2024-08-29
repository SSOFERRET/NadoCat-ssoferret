"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Notifications_1 = require("../controller/notification/Notifications");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.get("/", Notifications_1.serveNotifications);
router.get("/list", auth_1.ensureAutorization, Notifications_1.getNotificationList);
router.get("/all-read", auth_1.ensureAutorization, Notifications_1.getIsAllNotificationRead);
router.patch("", auth_1.ensureAutorization, Notifications_1.updateNotifications);
exports.default = router;
