import express from "express";
import { getHasNewNotification, getNotificationList, serveNotifications, updateNotifications } from "../controller/notification/Notifications";
import { ensureAutorization } from "../middleware/auth";

const router = express.Router();
router.use(express.json());

router.get("/", serveNotifications);
router.get("/list", ensureAutorization, getNotificationList);
router.get("/new", ensureAutorization, getHasNewNotification);
router.patch("", ensureAutorization, updateNotifications);

export default router;