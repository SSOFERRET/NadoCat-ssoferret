import express, { Router } from "express";
const router: Router = express.Router();
import {signup, login, kakao, google} from "../controller/user/Users";
import { my } from "../controller/user/MyPage";

router.use(express.json());

router.post("/signup", signup);
router.post("/login", login);
router.post("/auth/kakao", kakao);
router.post("/auth/google", google);
router.post("/my", my);

export default router;