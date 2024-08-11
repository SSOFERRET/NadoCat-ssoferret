import express, { Router } from "express";
const router: Router = express.Router();
import signup from "../controller/user/Users";
import {
  getFavoriteCats,
  getFavoriteCat,
  addFavoriteCat,
  deleteFavoriteCat
} from "../controller/streetCat/StreetCatsFavorite"

router.use(express.json());

//회원가입
router.post("/signup", signup);


// 동네 고양이 도감 즐겨찾기(내 도감)
router.get("/street-cats", getFavoriteCats);
router.get("/street-cats/:street_cat_id", getFavoriteCat);
router.post("/street-cats/:street_cat_id", addFavoriteCat);
router.delete("/street-cats/:street_cat_id", deleteFavoriteCat);

export default router;