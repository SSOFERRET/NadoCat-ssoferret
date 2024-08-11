import express, { Router } from "express";
const router: Router = express.Router();
import signup from "../controller/user/Users";
import {
  getFavoriteCats,
  getFavoriteCat,
  addFavoriteCat,
  deleteFavoriteCat
} from "../controller/streetCat/StreetCatsFavorite"
// import signup from "../controller/user/Users";
import { follow, followings, unfollow } from "../controller/friend/Friends";

router.use(express.json());

//회원가입
// router.post("/signup", signup);

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
