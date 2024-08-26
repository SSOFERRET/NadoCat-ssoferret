import React, { useCallback, useRef, useState } from "react";
import "../../styles/scss/components/streetCat/postDetail.scss";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IStreetCatDetail } from "../../models/streetCat.model";
import ImageCarousel from "../common/ImageCarousel";
import { IImage } from "../../models/image.model";
import FavoriteButton from "../common/FavoriteButton";
import PostMenu from "../communityAndEvent/PostMenu";
import { useDeleteStreetCatPost } from "../../hooks/useStreetCat";

interface IProps {
  postId?: number; 
  name?: string;
  createdAt?: Date;
  gender?: string;
  neutered?: string;
  content?: string;
  streetCatImages?: IImage[];
  streetCatFavorites?: [
    postId: number
  ]
}

const PostDetail = (props: IProps) => {
  const images: IImage[] = props.streetCatImages || [];
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  const {mutateAsync: removeStreetCatPost} = useDeleteStreetCatPost();

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <>
      <div className="cat-container">
        <span className="cat-name">{props.name}</span>
        <ImageCarousel images={images} />

        <div className="cat-info">
          <div className="cat-tag">
            <span>{props.gender}</span>
            <span>{props.neutered}</span>
            <span>{props.createdAt ? 
              (typeof props.createdAt === 'string' || typeof props.createdAt === 'number'
                ? new Date(props.createdAt).toLocaleDateString()
                : props.createdAt.toLocaleDateString()) 
              : ""}
            </span>
          </div>
          <div className="btn-box">
            {
              props.postId !== undefined && props.streetCatFavorites?.length !== undefined
              ? <FavoriteButton postId={props.postId} like={props.streetCatFavorites?.length}/>
              : ""
            }
            <span className="more-btn" onClick={toggleMenu}>
              <HiOutlineDotsVertical />
            </span>
          </div>
        </div>

        <div className="cat-content">
          <pre>
            {props.content}
          </pre>
        </div>
      </div>
      <PostMenu
        boardType="streetCat"
        menuType="post"
        postId={props.postId}
        isShowMenu={isMenuVisible}
        showMenu={toggleMenu}
        deletePost={removeStreetCatPost}
      />
    </>
  )
}

export default PostDetail;

