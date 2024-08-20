import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/css/pages/community/communityPostWrite.css";
import { AiOutlineClose } from "react-icons/ai";
import NewTagForm from "../../components/communityAndEvent/NewTagForm";
import NewTags from "../../components/communityAndEvent/NewTags";

// CHECKLIST
// [ ] 푸터 삭제
// [ ] 헤터 백버튼으로 변경
// [ ] 이미지 업로드 구현
// [ ] 해시테크 폼 만들기

const CommunityPostWrite = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState([]);

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "rem";
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "content") {
      setContent(value);
    }
  };

  const removeTags = (indexToRemove: number) => {
    const filter = newTags.filter((_, index) => index !== indexToRemove);
    setNewTags(filter);
  };

  const addNewTags = (tags: string[]) => {
    setNewTags(tags);
  };

  const handleTagFormOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    handleResizeHeight();
  }, [content]);

  return (
    <>
      <form onSubmit={handleSubmit} className="post-form">
        <div>
          <input className="title" type="text" placeholder="제목" required />
          <textarea
            onChange={handleChange}
            ref={textareaRef}
            name="content"
            value={content}
            rows={1}
            minLength={1}
            placeholder="내용을 입력해 주세요."
            required
          ></textarea>
          <div>이미지 자리</div>

          <button
            type="button"
            className="hash-tag-btn"
            onClick={handleTagFormOpen}
          >
            &#035; 해시태그를 입력해주세요 &#62;
          </button>

          <NewTags tags={newTags} removeTags={removeTags} />
        </div>
        <button className="post-submit">작성완료</button>
      </form>

      {isOpen && (
        <NewTagForm
          initialTags={newTags}
          addNewTags={addNewTags}
          handleTagFormOpen={handleTagFormOpen}
        />
      )}
    </>
  );
};

export default CommunityPostWrite;
