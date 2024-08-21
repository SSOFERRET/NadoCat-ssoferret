import "../../styles/scss/components/communityAndEvent/imageUploader.scss";
import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import { useThrottle } from "../../hooks/useThrottle";
import { AiOutlinePlus } from "react-icons/ai";
import DeleteButton from "../../assets/img/delete_button.svg";

//CHECKLIST
// [x] 로컬 이미지와 서버에서 받아온 이미지를 둘다 보여주기
// [x] 로컬 이미지 배열에 저장
// [x] 로컬 이미지가 삭제 되면 필터링
interface IProps<T> {
  newImages: T[];
  setNewImageFiles: <T extends string | File>(images: T[]) => void;
}

const ImageUploader = <T extends string | File>({ newImages, setNewImageFiles }: IProps<T>) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");

  const throttle = useThrottle();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (newImages.length >= 10) {
      setError("이미지는 최대 10개까지 선택 가능합니다.");
      return;
    }

    setError("");

    const files = e.target.files;

    if (files && files[0]) {
      setNewImageFiles([...newImages, files[0]]);
    }
  };

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

  const handleDeleteImage = (index: number) => {
    const filter = newImages.filter((_, i) => i !== index);
    setNewImageFiles(filter);

    if (newImages.length - 1 <= 10) {
      setError("");
      return;
    }
  };

  const onThrottleDragMove = throttle(onDragMove, 100);

  return (
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
              {typeof image === "string" ? (
                <img src={image} alt={`image-${index}`} />
              ) : (
                <img src={URL.createObjectURL(image)} alt={`image-${index}`} />
              )}
              <button type="button" onClick={() => handleDeleteImage(index)} className="delete-button">
                <img src={DeleteButton} alt="deleteButton" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {!!error && <span className="image-error">{error}</span>}
    </section>
  );
};

export default ImageUploader;
