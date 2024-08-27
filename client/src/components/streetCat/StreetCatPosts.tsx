import React /*,{ useCallback, useRef }*/ from "react";
import "../../styles/scss/components/streetCat/streetCatPosts.scss";
import { useStreetCatPosts } from "../../hooks/useStreetCats";
import { useIntersectionObserver } from "./IntersectionObserver";
import FavoriteButton from "../common/FavoriteButton";
import PostEmpty from "../communityAndEvent/PostEmpty";
import LoadingCat from "../loading/LoadingCat";
import { useLocation /*,useNavigate*/ } from "react-router-dom";

const StreetCatPosts: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromQuery = query.get("tab");

  const shouldFetchData = tabFromQuery === "1" || tabFromQuery === null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // status,
    isLoading,
    streetCatPosts,
    isEmpty,
  } = useStreetCatPosts(shouldFetchData);

    const moreRef = useIntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });
  
    const loadMore = () => {
      if (!hasNextPage) return;
      fetchNextPage();
    };
  
    if (!shouldFetchData) {
      return null;
    }
  
    if (isLoading) {
      return <LoadingCat />;
    }
  
    if (isEmpty) {
      return (
      <div className="empty-box">
        <PostEmpty />
      </div>
      );
    }

  console.log("1 data ", data);

  return (
    <div className="street-cat-posts">
      <p className="title">우리 동네 고양이</p>
      <ul className="street-cat-list">
        {streetCatPosts.map((cat) => (
          <li key={cat?.postId} className="street-cat">
            {cat?.postId !== undefined &&
            cat?.streetCatFavorites !== undefined ? (
              <FavoriteButton
                postId={cat.postId}
                like={cat.streetCatFavorites?.length}
              />
            ) : (
              ""
            )}
            <a href={`${location.pathname}/${cat?.postId}`}>
              <div className="img-box">
                <img src={cat?.streetCatImages[0]?.images.url} />
              </div>
              <div className="street-cat-info">
                <span className="name">{cat?.name}</span>
                <span className="date">
                  {new Date(cat?.createdAt as Date).toLocaleDateString()}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="more" ref={moreRef}></div>
      <div>{isFetchingNextPage && <p>Loading more...</p>}</div>
    </div>
  );
};

export default StreetCatPosts;
