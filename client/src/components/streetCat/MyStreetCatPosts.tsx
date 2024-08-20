import React from "react";
import "../../styles/css/components/streetCat/MyStreetCatPosts.css";
import { AiFillHeart } from "react-icons/ai";
import MyStreetCatEmpty from "./MyStreetCatEmpty";
import { useMyStreetCatPosts } from "../../hooks/useMyStreetCats";
import { useIntersectionObserver } from "./IntersectionObserver";

// NOTE 로그인 후 데이터 받아오기 해야함
// NOTE API 연결 해야함 (현재 뭔진 모르겠는데 서버 run 이슈있음...)
// CHECKLIST
// [ ] 로그인 후 좋아요 처리
// [x] 좋아요 버튼 클릭시 페이지 이동하지 않게 수정
// [ ] 좋아요 버튼 클릭시 목록에서 삭제
// [ ] 페이지네이션 무한스크롤 구현
// [ ] 글쓰기 버튼 고쳐야함(css)
// [ ] 로그인 안했을때 empty 컴포넌트 return

// 임시 데이터
const nickname = "프로집사";
const catCount = 6;

const MyStreetCatPosts: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    myStreetCatPosts,
    isEmpty
  } = useMyStreetCatPosts();
  console.log("hasNextPage", hasNextPage)

  const moreRef = useIntersectionObserver(([entry]) => {
    if(entry.isIntersecting) {
      loadMore();
    }
  })

  const loadMore = () => {
    if(!hasNextPage) return;
    fetchNextPage();
  }

  if(isEmpty) {
    return (<MyStreetCatEmpty />);
  }

  console.log(myStreetCatPosts)

  // if (myStreetCatPosts.length) {
  //   return (
  //     <>
  //       <p className="guide-text">
  //         <span className="nickname">{nickname}</span>님 도감에는 <br/>
  //         <span className="count">{catCount}</span>마리의 고양이가 있어요!
  //       </p>
  //       <ul className="street-cat-list">
  //         {
  //           myStreetCatPosts.map((cat) => (
  //             <li key={cat?.postId} className="street-cat">
  //               <a href={`${location.pathname}/${cat?.postId}`}>
  //                 <div className="img-box">
  //                   {/* <img src={cat?.thumbnail} /> */}
  //                   <AiFillHeart className={cat?.streetCatFavorites ? "active" : ""} onClick={() => console.log("click")}/>
  //                 </div>
  //                 <div className="street-cat-info">
  //                   <span className="name">{cat?.name}</span>
  //                   {/* <span className="date">{cat?.createdAt}</span> */}
  //                 </div>
  //               </a>
  //             </li>
  //           ))
  //         }
  //       </ul>

  //       <div className='more' ref={moreRef}></div>
  //       <div>{isFetchingNextPage && <p>Loading more...</p>}</div>
  //     </>
  //   )
  // } else {
    return (
      <MyStreetCatEmpty />
    )
  // }
}

export default MyStreetCatPosts;