import express, { Router } from "express";
const router: Router = express.Router();
// import signup from "../controller/user/Users";
import { follow, followings, unfollow } from "../controller/friend/Friends";

router.use(express.json());

//회원가입
// router.post("/signup", signup);

// 친구 맺기
router.post("/follows/:following_id", follow);

router.delete("/follows/:following_id", unfollow);

router.get("/followings", followings);

export default router;
