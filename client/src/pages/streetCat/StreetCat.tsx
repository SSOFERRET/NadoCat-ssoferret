import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import "../../styles/css/base/reset.css";
import "../../styles/css/pages/streetCat/streetCat.css";
import { Header } from "../../components/common/Header";
import { Footer } from "../../components/common/Footer";
import WriteButton from "../../components/common/WriteButton";
import TabNavigation from "../../components/streetCat/TabNavigation";
import StreetCatPosts from "../../components/streetCat/StreetCatPosts";

// interface IStreetCatPost {
//   postId: number;
//   thumbnail: string;
//   name: string;
//   createdAt: string; // api 연결시 Date로 변경
//   streetCatFavorites: number; // TODO: api 리턴값 1 or 0으로 변경해야함
// }


// TODO: 네비게이션 별로 해당 컴포넌트 불러오게 해야함

export const StreetCats: React.FC = () => {
  return (
    <>
      <section className="street-cat-section">
        <WriteButton />
        <TabNavigation />
        <StreetCatPosts />
      </section>
    </>
  )
}