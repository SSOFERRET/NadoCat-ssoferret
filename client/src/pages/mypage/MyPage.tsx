
// // import React, { /*useEffect,*/ useState } from "react";
// import BackButton from "../../components/common/BackButton";
// import "../../styles/scss/pages/mypage/MyPage.scss";
// import "../../styles/css/base/reset.css";
// import Posts from "../../components/mypage/Posts";
// import { useState } from "react";
// import axios from "axios";


// export interface Post {
//   title: string;
//   contents: string;
//   created_at: number;
//   views: number;
//   img?: string;
// }

// const ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:8080";

// const MyPage: React.FC = () => {
//   const [lists, setLists] = useState<Post[]>([]);

//   const uuid = sessionStorage.getItem("uuid");

//   // 데이터 로드 로직
//   try {
//     axios
//       .post(ENDPOINT + "/boards/Interests", {
//         userId: uuid,
//       })
//       .then((response) => {
//         setLists(response.data);
//         console.log(response.data);
//       });
//   } catch (error) {
//     console.log(error);
//   }

//   return (
//     <div className="myPage">
//       <div className="header">
//         <BackButton userName="" />
//         <div id="title">관심글</div>
//       </div>
//       <Posts />
//     </div>
//   );
// };

        /*
const MyPage = () => {
  return (
    <div className="myPage">
      <div className="header">
        <BackButton userName="" />
        <div id="title">관심글</div>
      </div>
      <Posts />
    </div>
  );
};
        */


// export default MyPage;
