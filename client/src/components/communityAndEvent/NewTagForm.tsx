import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import "../../styles/css/components/communityAndEvent/newTagForm.css";
import ModalPotal from "../modal/ModalPotal";
import { AiOutlineClose } from "react-icons/ai";
import NewTags from "./NewTags";

interface IProps {
  initialTags: string[];
  addNewTags: (tags: string[]) => void;
  handleTagFormOpen: () => void;
}

const NewTagForm = ({ initialTags, handleTagFormOpen, addNewTags }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tag, setTag] = useState<string>("");

  const removeTags = (indexToRemove: number) => {
    const filter = tags.filter((_, index) => index !== indexToRemove);
    setTags(filter);
  };

  const addTags = (value: string) => {
    if (value.trim() !== "") {
      setTags([...tags, value]);
      setTag("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTags(tag);
    }
  };

  const handleButtonClick = () => {
    addTags(tag);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.currentTarget.value);
  };

  const handleSubmit = () => {
    addNewTags(tags);
    handleTagFormOpen();
  };

  return (
    <ModalPotal>
      <div className="tag-form-container">
        <div className="overlay">
          <section className="new-tag-container">
            <div className="new-tag-buttons">
              <button
                type="button"
                className="tag-form-close-btn"
                onClick={handleTagFormOpen}
              >
                <AiOutlineClose />
              </button>
              <button className="done-btn" onClick={handleSubmit}>
                완료
              </button>
            </div>
            <span className="description">해시태그를 입력해 주세요.</span>
            <div className="tag-input-form">
              <input
                ref={inputRef}
                className="tag-input"
                type="text"
                name="newTag"
                placeholder="&#035; 해시태그"
                value={tag}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                autoFocus
              />
              <button
                type="button"
                className="tag-add-btn"
                onClick={handleButtonClick}
              >
                추가
              </button>
            </div>
            <NewTags tags={tags} removeTags={removeTags} />
          </section>
        </div>
      </div>
    </ModalPotal>
  );
};

export default NewTagForm;
