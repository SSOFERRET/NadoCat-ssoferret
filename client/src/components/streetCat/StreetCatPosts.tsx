import React, { useCallback, useRef } from "react";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import "../../styles/scss/components/streetCat/streetCatPosts.scss";
import { useStreetCatPosts } from "../../hooks/useStreetCats";
import { useIntersectionObserver } from "./IntersectionObserver";
import FavoriteButton from "../common/FavoriteButton";
import WriteButton from "../common/WriteButton";

// NOTE 로그인 후 데이터 받아오기 해야함
// CHECKLIST
// [ ] 로그인 후 좋아요 처리
// [x] 좋아요 버튼 클릭시 페이지 이동하지 않게 수정
// [ ] 커서 방식 무한 스크롤 구현
// [ ] 글쓰기 버튼 고쳐야함(css)

const StreetCatPosts: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    streetCatPosts,
    isEmpty
  } = useStreetCatPosts();

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
    return (<p>Not found</p>);
  }

  console.log(streetCatPosts)
  return (
    <>
      <WriteButton />
      <p className="title">우리 동네 고양이</p>
      <ul className="street-cat-list">
        {
          streetCatPosts.map((cat) => (
            <li key={cat?.postId} className="street-cat">
              {
                cat?.postId !== undefined && cat?.streetCatFavorites.length !== undefined
                ? <FavoriteButton postId={cat.postId} like={cat.streetCatFavorites?.length}/>
                : ""
              }
              <a href={`${location.pathname}/${cat?.postId}`}>
                <div className="img-box">
                  <img src={cat?.streetCatImages[0]?.images.url} />
                </div>
                <div className="street-cat-info">
                  <span className="name">{cat?.name}</span>
                  <span className="date">{new Date(cat?.createdAt as Date).toLocaleDateString()}</span>
                </div>
              </a>
            </li>
          ))
        }
      </ul>

      <div className='more' ref={moreRef}></div>
      <div>{isFetchingNextPage && <p>Loading more...</p>}</div>
    </>
  )
}

export default StreetCatPosts;