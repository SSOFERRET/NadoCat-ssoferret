import express from "express";
import { getNotificationList, serveNotifications, updateNotifications } from "../controller/notification/Notifications";

const router = express.Router();
router.use(express.json());

router.get("", serveNotifications);
router.get("/list", getNotificationList);
router.patch("", updateNotifications);

export default router;