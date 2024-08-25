import "../../styles/scss/pages/friends/friends.scss";
import useFriends from "../../hooks/useFriends";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import LoadingCat from "../../components/loading/LoadingCat";
import Spinner from "../../components/loading/Spinner";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import FriendList from "../../components/friend/FriendList";
import ServerError from "../../components/comment/CommentError";

const Friends = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } = useFriends();

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  return (
    <section className={`friends-container`}>
      {isLoading ? (
        <LoadingCat />
      ) : (
        <>
          <div className="category">
            <span>친구</span>
          </div>
          <>
            {isEmpty && <PostEmpty text="등록된 친구가 없어요." />}

            {error && <ServerError text="친구 목록을 불러올 수 없습니다." />}

            {data && <FriendList friends={data} />}

            <div className="more" ref={moreRef}>
              {isFetchingNextPage && <Spinner />}
            </div>
          </>
        </>
      )}
    </section>
  );
};

export default Friends;
