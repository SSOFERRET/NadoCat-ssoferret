import React, { useCallback, useRef } from "react";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import "../../styles/css/components/streetCat/streetCatPosts.css";
import { useStreetCatPosts } from "../../hooks/useStreetCats";
import { useIntersectionObserver } from "./IntersectionObserver";

// interface IStreetCatPost {
//   postId: number;
//   thumbnail: string;
//   name: string;
//   createdAt: string; // api 연결시 Date로 변경
//   streetCatFavorites?: number; // TODO: api 리턴값 1 or 0으로 변경해야함
// }

// NOTE 로그인 후 데이터 받아오기 해야함
// CHECKLIST
// [ ] 로그인 후 좋아요 처리
// [x] 좋아요 버튼 클릭시 페이지 이동하지 않게 수정
// [ ] 커서 방식 무한 스크롤 구현
// [ ] 글쓰기 버튼 고쳐야함(css)
// const testData: IStreetCatPost[] = [
//   {
//     postId: 1,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 1",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 2,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 2",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 3,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 3",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 4,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 4",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 1
//   },
//   {
//     postId: 5,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 5",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 6,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 6",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 7,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 7",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 8,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 8",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 9,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 9",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 10,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 10",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 11,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 11",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 12,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 12",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 13,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 13",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 14,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 14",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 15,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 15",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 16,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 16",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 17,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 17",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 18,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 18",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 19,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 19",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
//   {
//     postId: 20,
//     thumbnail: "https://cdn.pixabay.com/photo/2018/05/25/18/04/nature-3429700_1280.jpg",
//     name: "테스트 20",
//     createdAt: "2024년 8월 10일",
//     streetCatFavorites: 0
//   },
// ]

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
    return (<p>Not found</p>);
  }

  console.log(streetCatPosts);

  
  return (
    <>
      <p className="title">우리 동네 고양이</p>
      <ul className="street-cat-list">
        {
          streetCatPosts.map((cat) => (
            <li key={cat?.postId} className="street-cat">
              {
                cat?.streetCatFavorites
                ? <AiFillHeart className="active" onClick={() => alert("click")}/>
                : <AiOutlineHeart onClick={() => alert("click")}/>
              }
              <a href={`${location.pathname}/${cat?.postId}`}>
                <div className="img-box">
                  <img src={cat?.thumbnail} />
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