import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controller/event/EventComments";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "../controller/event/Events";
const router = express.Router();

router.get("/", getEvents);

router.post("/", createEvent);

router.get("/:evnet_id", getEvent);

router.put("/:evnet_id", updateEvent);

router.delete("/:evnet_id", deleteEvent);

router.get("/:community_id/comments", getComments);

router.post("/:community_id/comments", createComment);

router.put("/:community_id/comments/:comment_id", updateComment);

router.delete("/:community_id/comments/:comment_id", deleteComment);

export default router;
