import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import "../../styles/css/components/communityAndEvent/newTagForm.css";
import ModalPotal from "../modal/ModalPotal";
import { AiOutlineClose } from "react-icons/ai";
import NewTags from "./NewTags";

// CHECKLIST
// [x] 해시태그 수 글자수 제한
// [ ] 해시태그 수 제한
interface IProps {
  initialTags: string[];
  addNewTags: (tags: string[]) => void;
  handleTagFormOpen: () => void;
}

const NewTagForm = ({ initialTags, handleTagFormOpen, addNewTags }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tag, setTag] = useState<string>("");
  const [error, setError] = useState("");

  const removeTags = (indexToRemove: number) => {
    const filter = tags.filter((_, index) => index !== indexToRemove);
    setTags(filter);
  };

  const addTags = (value: string) => {
    if (tags.length >= 20) {
      setError("태그는 20개까지 입력 가능합니다.");
      return;
    }

    if (value.trim() !== "" && !error.length) {
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
    const value = e.target.value;

    if (value.length > 21) {
      setError("태그는 1 ~ 20글자까지 입력 가능합니다.");
    } else {
      setError("");
      setTag(value);
    }
  };

  const handleSubmit = () => {
    if (tags.length > 20) {
      setError("태그는 20개까지 입력 가능합니다.");
      return;
    }

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
                min={1}
                // maxLength={20}
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
            {!!error && <span className="tag-error">{error}</span>}
            <NewTags tags={tags} removeTags={removeTags} />
          </section>
        </div>
      </div>
    </ModalPotal>
  );
};

export default NewTagForm;
