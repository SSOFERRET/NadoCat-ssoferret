import express from "express";
const router = express.Router();
router.use(express.json());

import { getInterests } from "../controller/interest/Interests";

router.get('/', getInterests);

export default router;
