import express, { Router } from "express";
import {signup, login, kakao, google} from "../controller/user/Users";
import { my } from "../controller/user/MyPage";
import {
  getFavoriteCats,
  getFavoriteCat,
  addFavoriteCat,
  deleteFavoriteCat
} from "../controller/streetCat/StreetCatsFavorite"
import { follow, followings, unfollow } from "../controller/friend/Friends";

const router: Router = express.Router();
//router.use(express.json());

//회원가입
router.post("/signup", signup);
router.post("/login", login);
router.post("/auth/kakao", kakao);
router.post("/auth/google", google);
router.post("/my", my);

// 동네 고양이 도감 즐겨찾기(내 도감)
router.get("/street-cats", getFavoriteCats);
router.get("/street-cats/:street_cat_id", getFavoriteCat);
router.post("/street-cats/:street_cat_id", addFavoriteCat);
router.delete("/street-cats/:street_cat_id", deleteFavoriteCat);

// 친구 맺기
router.post("/follows/:following_id", follow);

router.delete("/follows/:following_id", unfollow);

router.get("/followings", followings);

export default router;