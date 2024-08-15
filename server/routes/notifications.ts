import express from "express";
import { serveNotifications } from "../controller/notification/Notifications";

const router = express.Router();
router.use(express.json());

router.get("", serveNotifications);

export default router;