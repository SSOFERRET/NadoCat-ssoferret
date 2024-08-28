import { IMissing } from "../../models/missing.model";
import PostAbstract from "./missingPost/PostAbstract";
import PostInfo from "./missingPost/PostInfo";
import "./../../styles/scss/components/missing/missingPost.scss";
// import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PostMenu from "../communityAndEvent/PostMenu";
import useMissing from "../../hooks/useMissing";

interface IProps {
  post: IMissing;
}

const MissingPost = ({ post }: IProps) => {
  // const navigate = useNavigate();
  // const location = useLocation();
  const [isShowMenu, setIsShowMenu] = useState(false);

  // const navigateToPostDetail = () =>
  //   navigate(`${location.pathname}/${post.postId}`);

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const { removeMissingPost } = useMissing(post.postId);

  console.log(post);

  return (
    <>
      <section className="post-box">
        <PostAbstract post={post} showMenu={showMenu} />
        <PostInfo reports={10} views={post.views} />
      </section>
      <PostMenu
        boardType="missing"
        menuType="post"
        postId={post.postId}
        showMenu={showMenu}
        isShowMenu={isShowMenu}
        deletePost={removeMissingPost}
        found={post.found}
      />
    </>
  );
  // 좋아요 리포트 수 (-)
};

export default MissingPost;
