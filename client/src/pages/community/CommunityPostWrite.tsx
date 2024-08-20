import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../styles/css/pages/community/communityPostWrite.css";
import NewTagForm from "../../components/communityAndEvent/NewTagForm";
import NewTags from "../../components/communityAndEvent/NewTags";
import DeleteButton from "../../assets/img/delete_button.svg";
import { AiOutlinePlus } from "react-icons/ai";
import { useThrottle } from "../../hooks/useThrottle";

// CHECKLIST
// [ ] 푸터 삭제
// [ ] 헤더 백버튼으로 변경
// [ ] 이미지 업로드 구현
// [x] 해시테크 폼 만들기
// [x] 이미지 슬라이드(?) UI 만들기
// [x] 로컬 이미지 받아오기
// [x] 로컬 이미지 UI로 보여주기
// [x] 이미지 삭제

const CommunityPostWrite = () => {
  const throttle = useThrottle();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | undefined>(undefined);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState("");

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

  // NOTE 게시글 작성 버튼에 들어갈 함수
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (newImages.length >= 10) {
      setError("이미지는 최대 10개까지 선택 가능합니다.");
      return;
    }

    setError("");

    const files = e.target.files;

    if (files && files[0]) {
      setNewImages([...newImages, files[0]]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));

    if (newImages.length - 1 <= 10) {
      console.log(newImages.length);
      setError("");
      return;
    }
  };

  useEffect(() => {
    handleResizeHeight();
  }, [content]);

  const onDragStart = (e: MouseEvent) => {
    e.preventDefault();
    setIsDrag(true);
    if (scrollRef.current) {
      setStartX(e.pageX + scrollRef.current.scrollLeft);
    }
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: MouseEvent) => {
    if (isDrag && scrollRef.current && startX !== undefined) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

      scrollRef.current.scrollLeft = startX - e.pageX;

      if (scrollLeft === 0) {
        setStartX(e.pageX);
      } else if (scrollWidth <= clientWidth + scrollLeft) {
        setStartX(e.pageX + scrollLeft);
      }
    }
  };

  const onThrottleDragMove = throttle(onDragMove, 100);

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

          <section className="images-container">
            <div className="add-images" ref={scrollRef}>
              <div
                className="image-list"
                onMouseDown={onDragStart}
                onMouseMove={isDrag ? onThrottleDragMove : undefined}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                ref={scrollRef}
              >
                <label htmlFor="input-file" className="upload-label">
                  <input
                    type="file"
                    id="input-file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <AiOutlinePlus className="add-icon" />
                </label>
                {newImages.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`image-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="delete-button"
                    >
                      <img src={DeleteButton} alt="deleteButton" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {!!error && <span className="image-error">{error}</span>}
          </section>

          <div className="hash-tag-wrapper">
            <button
              type="button"
              className="hash-tag-btn"
              onClick={handleTagFormOpen}
            >
              &#035; 해시태그를 입력해주세요 &#62;
            </button>

            <NewTags tags={newTags} removeTags={removeTags} />
          </div>
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
