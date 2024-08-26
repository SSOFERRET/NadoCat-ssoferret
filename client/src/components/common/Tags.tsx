// import React from "react";
import "../../styles/scss/components/common/tags.scss";
import { ITag } from "../../models/tag.model";

type Size = "sm" | "md";

interface IProps {
  tags: ITag[];
  size?: Size;
}

const getSizeClass = (size: Size): string => {
  switch (size) {
    case "sm":
      return "tags-sm";
    case "md":
      return "tags-md";
    default:
      throw new Error(`일치하는 size 값이 없음: ${size}`);
  }
};

const Tags = ({ tags, size = "md" }: IProps) => {
  const sizeClass = getSizeClass(size);

  return (
    <div className={`tags ${sizeClass}`}>
      {tags.map((tag: ITag) => (
        <span className="tag" key={tag.tagId}>
          &#035; {tag.tag}
        </span>
      ))}
    </div>
  );
};

export default Tags;
