import "../../styles/scss/pages/event/eventPostWrite.scss";
import { useNavigate } from "react-router-dom";
import useEvents from "../../hooks/useEvents";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import PostWriteForm from "../../components/communityAndEvent/PostWriteForm";

const EventPostWrite = () => {
  const navigate = useNavigate();
  const { addEventPost } = useEvents({ enabled: true });

  const addPost = (formData: FormData) => {
    addEventPost(formData).then((data) => {
      navigate(`/boards/events/${data.postId}`);
    });
  };
  return (
    <div className="community-post-edit">
      <HeaderWithBackButton path="/boards/events" />

      <PostWriteForm boardCategory="event" addPost={addPost} />
    </div>
  );
};

export default EventPostWrite;
