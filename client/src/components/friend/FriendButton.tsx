import "../../styles/scss/components/friend/friendButton.scss";
import useFriend from "../../hooks/useFriend";

interface IProps {
  followingId: string;
}

const FriendButton = ({ followingId }: IProps) => {
  const { friend, follow, unfollow } = useFriend({ followingId });

  const toggleFriend = () => {
    friend ? unfollow(followingId) : follow(followingId);
  };

  return (
    <section className="friend-button-container">
      <button className={`friend-button ${!friend ? "default" : "active"}`} onClick={toggleFriend}>
        {friend ? "친구삭제" : "친구맺기"}
      </button>
    </section>
  );
};

export default FriendButton;
