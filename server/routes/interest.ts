import express from "express";
import { ensureAutorization } from "../middleware/auth";

const router = express.Router();
router.use(express.json());

import { getInterests } from "../controller/interest/Interests";

router.post('/boards/Interests', getInterests);

export default router;
