import express from "express";
import { getIsAllNotificationRead, getNotificationList, serveNotifications, updateNotifications } from "../controller/notification/Notifications";

const router = express.Router();
router.use(express.json());

router.get("/", serveNotifications);
router.get("/list", getNotificationList);
router.get("/all-read", getIsAllNotificationRead);
router.patch("", updateNotifications);

export default router;