import { /*IMissing,*/ IMissing, IMissingReport } from "../../models/missing.model";
import "./../../styles/scss/components/missing/missingReportPost.scss";
import PostHead from "./missingPost/PostHead";
import PostSummary from "./common/PostSummary";
import MapBox from "../common/MapBox";
import { useState } from "react";
import MissingReportPostMenu from "./MissingReportPostMenu";
import { useParams } from "react-router-dom";
import { useDeleteMissingReport } from "../../hooks/useMissingReport";
import defaultImage from "../../assets/img/heartCat.png";
import ImageCarousel from "../common/ImageCarousel";
import { RxCross1 } from "react-icons/rx";
import { useAuthStore } from "../../store/userStore";

interface IProps {
  post: IMissingReport;
  missing: IMissing;
}

const MissingReportPost = ({ post, missing }: IProps) => {
  const { uuid } = useAuthStore(); 
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
    console.log("show?", isShowMenu);
  };
  const loginUser = uuid || "";
  const postId = Number(useParams().id);
  const { mutateAsync: deletePost } = useDeleteMissingReport();

  const openImageModal = () => {
    setIsOpenModal(true);
  };

  const closeImageModal = () => {
    setIsOpenModal(false);
  };

  const handleImageModal = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.target === e.currentTarget);
    if (e.target === e.currentTarget) {
      setIsOpenModal((prev) => !prev);
    }
  };

  return (
    <>
      <section className={`report-post-box ${post.match}`}>
        <PostHead data={post} showMenu={showMenu} />
        <div className="image-map">
          <div className="image-container" onClick={openImageModal}>
            {post.images.length > 0 ? (
              <img src={post.images[0].url} alt={post.images[0].imageId.toString()} />
            ) : (
              <img src={defaultImage} />
            )}
          </div>

          <div className="map-container">
            <MapBox locations={post.locations} />
          </div>
        </div>

        <PostSummary data={post} />
      </section>

      <MissingReportPostMenu
        postUser={post.users.uuid}
        loginUser={loginUser}
        ownerUser={missing.users.uuid}
        reportId={post.postId}
        deletePost={deletePost}
        matchState={post.match}
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
      />

      {post.images.length > 0 && isOpenModal && (
        <div className="image-modal">
          <div className="image-modal-overlay" onClick={handleImageModal}>
            <div className={`button-container`}>
              <button className="close-button" onClick={closeImageModal}>
                <RxCross1 />
              </button>
            </div>
            <div className="image-box">
              <ImageCarousel isDots={false} images={post.images} round="round-0" />
            </div>
          </div>
        </div>
      )}
    </>
  );
  // 좋아요 리포트 수 (-)
};

export default MissingReportPost;
