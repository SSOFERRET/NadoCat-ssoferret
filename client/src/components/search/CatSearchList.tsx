import React /*,{ useCallback, useRef }*/ from "react";
import "../../styles/scss/components/streetCat/streetCatPosts.scss";
import { ISearch } from "../../hooks/useSearch";
import { IMissing } from "../../models/missing.model";

export interface ICat {
  postId: number;
  content: string;
  location: { longitude: number; latitude: number; detail: string };
  name: string;
  users: {
    uuid: Buffer;
    nickname: string;
    profileImage: string;
  };
  createdAt: string;
  image: string;
}

const CatSearchList: React.FC<{ posts: ISearch[]; category: string }> = ({
  posts,
  category,
}) => {
  console.log("데이터", posts[0]._source);
  return (
    <div className="street-cat-posts">
      <ul className="street-cat-list">
        {posts.map((post: ISearch) => (
          <li key={post._id} className="street-cat">
            <a href={`${location.pathname}/${post._source.postId}`}>
              <div className="img-box">
                <img
                  src={
                    category === "missings" ? "" : (post._source as ICat).image
                  }
                />
              </div>
              <div className="street-cat-info">
                <span className="name">
                  {category === "missings"
                    ? `${(post._source as IMissing).users.nickname} 님네 ${
                        (post._source as IMissing).missingCats.name
                      }를 찾고 있습니다.`
                    : `${(post._source as ICat).users.nickname} 님이 돌보는 ${
                        (post._source as ICat).name
                      }`}
                </span>

                <span className="date">
                  {new Date(
                    (post._source as ICat | IMissing).createdAt as string
                  ).toLocaleDateString()}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatSearchList;
