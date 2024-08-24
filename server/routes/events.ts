import express from "express";
import { createComment, deleteComment, getComments, updateComment } from "../controller/event/EventComments";
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from "../controller/event/Events";
import uploadImages from "../multer";
import { ensureAutorization } from "../middleware/auth";
const router = express.Router();

router.get("/", getEvents);

router.post("/", ensureAutorization, uploadImages.array("images"), createEvent);

router.get("/:event_id", getEvent);

router.put("/:event_id", ensureAutorization, uploadImages.array("images"), updateEvent);

router.delete("/:event_id", ensureAutorization, deleteEvent);

router.get("/:community_id/comments", getComments);

router.post("/:community_id/comments", ensureAutorization, createComment);

router.put("/:community_id/comments/:comment_id", ensureAutorization, updateComment);

router.delete("/:community_id/comments/:comment_id", ensureAutorization, deleteComment);

export default router;
