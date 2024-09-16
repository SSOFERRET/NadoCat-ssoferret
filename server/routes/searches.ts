import express, { Request, Response } from "express";
import { searchDocuments, searchDocumentsAsCategory, } from "../controller/search/Searches";

const router = express.Router();
router.use(express.json());

router.get("", searchDocuments);
router.get("/communities", (req: Request, res: Response) => searchDocumentsAsCategory(req, res, "communities"));
router.get("/events", (req: Request, res: Response) => searchDocumentsAsCategory(req, res, "events")); router.get("/missings", (req: Request, res: Response) => searchDocumentsAsCategory(req, res, "missings"));
export default router;