import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../styles/scss/pages/community/communityPostWrite.scss";
import NewTagForm from "../../components/communityAndEvent/NewTagForm";
import NewTags from "../../components/communityAndEvent/NewTags";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import ImageUploader from "../../components/communityAndEvent/ImageUploader";
import useCommunities from "../../hooks/useCommunities";
import { useNavigate } from "react-router-dom";

// CHECKLIST
// [x] 푸터 삭제
// [x] 헤더 백버튼으로 변경
// [x] 이미지 업로드 구현
// [x] 해시테크 폼 만들기
// [x] 이미지 슬라이드(?) UI 만들기
// [x] 로컬 이미지 받아오기
// [x] 로컬 이미지 UI로 보여주기
// [x] 이미지 삭제

const CommunityPostWrite = () => {
  const navigate = useNavigate();
  const { addCommunityPost } = useCommunities();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<(string | File)[]>([]);

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

  const setNewImageFiles = <T extends string | File>(images: T[]) => {
    setNewImages([...images]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(newTags));

    Array.from(newImages).forEach((image) => {
      formData.append("images", image);
    });

    addCommunityPost(formData)
      .then((data) => {
        console.log(data);
        navigate(`/boards/communities/${data.postId}`);
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

export default CommunityPostWrite;
