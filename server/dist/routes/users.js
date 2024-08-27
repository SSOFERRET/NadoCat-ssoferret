"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Users_1 = require("../controller/user/Users");
const validator_1 = require("../middleware/validator");
const MyPage_1 = require("../controller/user/MyPage");
const StreetCatsFavorite_1 = require("../controller/streetCat/StreetCatsFavorite");
const Friends_1 = require("../controller/friend/Friends");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../multer"));
const router = express_1.default.Router();
//사용자
router.post("/signup", validator_1.signupValidator, Users_1.signup);
router.post("/login", validator_1.loginValidator, Users_1.login);
router.post("/logout", auth_1.ensureAutorization, Users_1.logout);
router.post("/refresh-token", Users_1.getNewAccessToken);
router.get("/auth/kakao/callback", Users_1.kakao);
router.get("/auth/google", Users_1.google);
router.get("/my/:uuid", auth_1.ensureAutorization, MyPage_1.mypage);
router.put("/update-nickname", MyPage_1.updateNickname);
router.put("/update-password", MyPage_1.updatePassword);
router.post("/update-profile", auth_1.ensureAutorization, multer_1.default.single("profileImage"), MyPage_1.updateProfile);
router.put("/delete-profile", auth_1.ensureAutorization, MyPage_1.deleteProfile);
// 동네 고양이 도감 즐겨찾기(내 도감)
router.get("/street-cats", StreetCatsFavorite_1.getFavoriteCats);
router.get("/street-cats/:street_cat_id", StreetCatsFavorite_1.getFavoriteCat);
router.post("/street-cats/:street_cat_id", StreetCatsFavorite_1.addFavoriteCat);
router.delete("/street-cats/:street_cat_id", StreetCatsFavorite_1.deleteFavoriteCat);
// 친구 맺기
router.post("/follows/:following_id", auth_1.ensureAutorization, Friends_1.follow);
router.delete("/follows/:following_id", auth_1.ensureAutorization, Friends_1.unfollow);
router.get("/followings", auth_1.ensureAutorization, Friends_1.followings);
exports.default = router;
