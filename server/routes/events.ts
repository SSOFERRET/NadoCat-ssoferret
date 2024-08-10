import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "../controller/event/events";
const router = express.Router();

router.get("/", getEvents);

router.post("/", createEvent);

router.get("/:evnet_id", getEvent);

router.put("/:evnet_id", updateEvent);

router.delete("/:evnet_id", deleteEvent);

export default router;
