import "../../styles/scss/components/communityAndEvent/newTagForm.scss";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import ModalPotal from "../modal/ModalPotal";
import { AiOutlineClose } from "react-icons/ai";
import NewTags from "./NewTags";

// CHECKLIST
// [x] 해시태그 수 글자수 제한
// [x] 해시태그 수 제한
// [x] 삭제될 태그 저장
interface IProps {
  initialTags: string[];
  addTagsToDelete?: (ids: string[]) => void;
  addNewTags: (tags: string[]) => void;
  handleTagFormOpen: () => void;
}

const NewTagForm = ({ initialTags, handleTagFormOpen, addNewTags, addTagsToDelete }: IProps) => {
  const oldTags = initialTags;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tag, setTag] = useState<string>("");
  const [error, setError] = useState("");
  const [saveTags, setSaveTags] = useState<string[]>([]);

  const removeTags = (indexToRemove: number, tag: string) => {
    const foundTag = oldTags.find((item) => item === tag);

    if (foundTag) {
      setSaveTags([...saveTags, foundTag]);
    }

    const filter = tags.filter((_, index) => index !== indexToRemove);
    setTags(filter);
  };

  const addTags = (value: string) => {
    if (tags.length >= 20) {
      setError("태그는 20개까지 입력 가능합니다.");
      return;
    }

    if (value.trim() === "") {
      setError("한 글자 이상 입력해 주세요.");
      return;
    }

    if (tags.includes(value)) {
      setError("같은 태그는 중복으로 사용할 수 없습니다. 다른 태그를 입력해 주세요.");
      return;
    }

    if (!error.length) {
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

    addTagsToDelete && addTagsToDelete(saveTags);

    addNewTags(tags);
    handleTagFormOpen();
  };

  return (
    <ModalPotal>
      <div className="tag-form-container">
        <div className="overlay">
          <section className="new-tag-container">
            <div className="new-tag-buttons">
              <button type="button" className="tag-form-close-btn" onClick={handleTagFormOpen}>
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
              <button type="button" className="tag-add-btn" onClick={handleButtonClick}>
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
