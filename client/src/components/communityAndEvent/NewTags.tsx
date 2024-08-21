import "../../styles/scss/components/communityAndEvent/newTags.scss";
import { AiOutlineClose } from "react-icons/ai";

interface IProsp {
  tags: string[];
  removeTags: (index: number) => void;
}

const NewTags = ({ tags, removeTags }: IProsp) => {
  return (
    <ul className="new-tags">
      {tags.map((tag: string, index: number) => (
        <li className="tag" key={index}>
          <span> &#035; {tag}</span>
          <button onClick={() => removeTags(index)} type="button" className="tag-delete-btn">
            <AiOutlineClose />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NewTags;
