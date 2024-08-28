import { useParams } from "react-router-dom";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import MissingPostDetail from "../../components/missing/MissingPostDetail";
import useMissing from "../../hooks/useMissing";
import "../../styles/scss/pages/missing/missingDetail.scss";
import {
  IMissing,
  // IMissingReport,
  // IMissingReportPosts,
} from "../../models/missing.model";
import LoadingCat from "../../components/loading/LoadingCat";
// import MissingReportPost from "../../components/missing/MissingReportPost";
import useMissingReports from "../../hooks/useMissingReports";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import MissingReportPostList from "../../components/missing/MissingReportPostList";
import PostMenu from "../../components/communityAndEvent/PostMenu";
import { useState } from "react";
import NewPostButton from "../../components/common/NewPostButton";
import { Footer } from "../../components/common/Footer";

const MissingDetail = () => {
  const params = useParams();
  const postId = Number(params.id);
  const {
    data: post,
    // error,
    isLoading,
    removeMissingPost,
  } = useMissing(postId);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const {
    reportsData,
    isReportsLoading,
    // reportsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // isFetching,
    // isEmpty,
  } = useMissingReports(postId);

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  return (
    <section className="missing-detail">
      <HeaderWithBackButton />
      {(isLoading || isReportsLoading) && <LoadingCat />}
      {!isLoading && <MissingPostDetail post={post as IMissing} showMenu={showMenu} />}

      {reportsData && <MissingReportPostList posts={reportsData} missing={post as IMissing} />}

      <div className="more" ref={moreRef}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>

      <PostMenu
        boardType="missing"
        menuType="post"
        postId={postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deletePost={removeMissingPost}
      />

      <NewPostButton path={`/boards/missings/${postId}/report/write`} text="제보하기" />
      <Footer />
    </section>
  );
};

export default MissingDetail;
