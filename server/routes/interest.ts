import express from "express";
import { ensureAutorization } from "../middleware/auth";

const router = express.Router();
router.use(express.json());

import { getInterests } from "../controller/interest/Interests";

router.post('/', ensureAutorization , getInterests);

export default router;
