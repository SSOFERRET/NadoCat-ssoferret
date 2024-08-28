import React /*,{ useCallback, useRef }*/ from "react";
import "../../styles/scss/components/streetCat/streetCatPosts.scss";

const CatSearchComponent: React.FC = () => {
  return (
    <div className="street-cat">
      <a href={"asdf"}>
        <div className="img-box">
          <img src={""} />
        </div>
        <div className="street-cat-info">
          <span className="name">{"고양이"}</span>
          <span className="date">
            {new Date("2020-12-20").toLocaleDateString()}
          </span>
        </div>
      </a>
    </div>
  );
};

export default CatSearchComponent;
