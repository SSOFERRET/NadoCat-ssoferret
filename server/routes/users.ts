import express from "express";
import { signup, login, kakao, google, getNewAccessToken, logout } from "../controller/user/Users";
import { signupValidator, loginValidator } from "../middleware/validator";
import { mypage, updateNickname, updatePassword, updateProfile, deleteProfile } from "../controller/user/MyPage";
import {
  getFavoriteCats,
  getFavoriteCat,
  addFavoriteCat,
  deleteFavoriteCat,
} from "../controller/streetCat/StreetCatsFavorite";
import { follow, followings, unfollow } from "../controller/friend/Friends";
import { ensureAutorization } from "../middleware/auth";
import uploadImages from "../multer";

const router = express.Router();

//사용자
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", ensureAutorization, logout);
router.post("/refresh-token", getNewAccessToken);
router.get("/auth/kakao/callback", kakao);
router.get("/auth/google", google);
router.get("/my/:uuid", ensureAutorization, mypage); 
router.put("/update-nickname", updateNickname);
router.put("/update-password", updatePassword);

router.post("/update-profile",ensureAutorization, uploadImages.single("profileImage"),updateProfile);
router.put("/delete-profile",ensureAutorization, deleteProfile);

// 동네 고양이 도감 즐겨찾기(내 도감)
router.get("/street-cats", getFavoriteCats);
router.get("/street-cats/:street_cat_id", getFavoriteCat);
router.post("/street-cats/:street_cat_id", addFavoriteCat);
router.delete("/street-cats/:street_cat_id", deleteFavoriteCat);

// 친구 맺기
router.post("/follows/:following_id", ensureAutorization, follow);
router.delete("/follows/:following_id", ensureAutorization, unfollow);
router.get("/followings", ensureAutorization, followings);

export default router;
