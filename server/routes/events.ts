import express from "express";
import { createComment, deleteComment, getComments, updateComment } from "../controller/event/EventComments";
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from "../controller/event/Events";
import uploadImages from "../multer";
const router = express.Router();

router.get("/", getEvents);

router.post("/", uploadImages.array("images"), createEvent);

router.get("/:event_id", getEvent);

router.put("/:event_id", uploadImages.array("images"), updateEvent);

router.delete("/:event_id", deleteEvent);

router.get("/:community_id/comments", getComments);

router.post("/:community_id/comments", createComment);

router.put("/:community_id/comments/:comment_id", updateComment);

router.delete("/:community_id/comments/:comment_id", deleteComment);

export default router;