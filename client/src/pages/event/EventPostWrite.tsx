import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/scss/pages/event/eventPostWrite.scss";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../../components/communityAndEvent/ImageUploader";
import useEvents from "../../hooks/useEvents";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import NewTagForm from "../../components/communityAndEvent/NewTagForm";
import NewTags from "../../components/communityAndEvent/NewTags";

const EventPostWrite = () => {
  const navigate = useNavigate();
  const { addEventPost } = useEvents();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "rem";
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "content") {
      setContent(value);
    } else if (name === "title") {
      setTitle(value);
    } else if (name === "status") {
      setIsClosed((prev) => !prev);
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

  const setNewImageFiles = (images: File[]) => {
    setNewImages([...images]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("isClosed", isClosed ? "true" : "");
    formData.append("tags", JSON.stringify(newTags));

    Array.from(newImages).forEach((image) => {
      formData.append("images", image);
    });

    addEventPost(formData)
      .then((data) => {
        navigate(`/boards/events/${data.postId}`);
      })
      .catch(console.error)
      .finally();
  };

  useEffect(() => {
    handleResizeHeight();
  }, [textareaRef.current?.value]);

  return (
    <div className="community-post-write">
      <HeaderWithBackButton />
      <form onSubmit={handleSubmit} className="post-form">
        <div>
          <input
            className="title"
            name="title"
            onChange={handleChange}
            min={1}
            type="text"
            placeholder="제목"
            required
          />

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

          <ImageUploader newImages={newImages} setNewImageFiles={setNewImageFiles} />

          <div className="status-selection">
            <span className="status-title">모집</span>
            <div className="status-buttons">
              <input
                className="open"
                onChange={handleChange}
                type="radio"
                id="open"
                name="status"
                checked={!isClosed}
                value="open"
              />
              <label htmlFor="open">모집</label>

              <input
                className="closed"
                onChange={handleChange}
                type="radio"
                id="closed"
                name="status"
                checked={isClosed}
                value="closed"
              />
              <label htmlFor="closed">마감</label>
            </div>
          </div>

          <div className="hash-tag-wrapper">
            <button type="button" className="hash-tag-btn" onClick={handleTagFormOpen}>
              &#035; 해시태그를 입력해주세요 &#62;
            </button>

            <NewTags tags={newTags} removeTags={removeTags} />
          </div>
        </div>
        <button className="post-submit">작성완료</button>
      </form>

      {isOpen && <NewTagForm initialTags={newTags} addNewTags={addNewTags} handleTagFormOpen={handleTagFormOpen} />}
    </div>
  );
};

export default EventPostWrite;
