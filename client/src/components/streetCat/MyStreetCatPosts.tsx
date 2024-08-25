import React from "react";
import "../../styles/scss/components/streetCat/MyStreetCatPosts.scss";
import MyStreetCatEmpty from "./MyStreetCatEmpty";
import { useMyStreetCatPosts } from "../../hooks/useMyStreetCats";
import { useIntersectionObserver } from "./IntersectionObserver";
import { useLocation } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";
import FavoriteButton from "../common/FavoriteButton";

// NOTE 로그인 후 데이터 받아오기 해야함

const MyStreetCatPosts: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromQuery = query.get('tab');
  const shouldFetchData = tabFromQuery === '2';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    myStreetCatPosts,
    isEmpty,
    nickname,
    myCatCount
  } = useMyStreetCatPosts(shouldFetchData);

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

  if (!shouldFetchData) {
    return null;
  }

  if (myStreetCatPosts.length) {
    return (
      <>
        <p className="guide-text">
          <span className="nickname">{nickname}</span>님 도감에는 <br/>
          <span className="count">{myCatCount}</span>마리의 고양이가 있어요!
        </p>
        <ul className="street-cat-list">
          {
            myStreetCatPosts.map((cat) => (
              <li key={cat?.postId} className="street-cat">
                {/* <GoHeartFill className={cat?.streetCatFavorites ? "active" : ""} onClick={() => alert("click")}/> */}
                <FavoriteButton postId={cat?.postId} like={cat?.streetCatFavorites?.length}/>
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
  } else {
    return (
      <MyStreetCatEmpty />
    )
  }
}

export default MyStreetCatPosts;
