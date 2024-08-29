import express from "express";
import { getIsAllNotificationRead, getNotificationList, serveNotifications, updateNotifications } from "../controller/notification/Notifications";
import { ensureAutorization } from "../middleware/auth";

const router = express.Router();
router.use(express.json());

router.get("/", serveNotifications);
router.get("/list", ensureAutorization, getNotificationList);
router.get("/all-read", ensureAutorization, getIsAllNotificationRead);
router.patch("", ensureAutorization, updateNotifications);

export default router;