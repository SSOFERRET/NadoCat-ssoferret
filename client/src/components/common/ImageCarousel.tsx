import { useState } from "react";
import "../../styles/css/components/common/imageCarousel.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IImage } from "../../models/image.model";

//TODO 시간 되면 드래그로 넘기기 기능 추가하기

interface IProps {
  images: IImage[];
}

const ImageCarousel = ({ images }: IProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex === images.length - 1) {
      return;
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    if (!currentIndex) {
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const paginationHandler = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div className="carousel-item" key={image.imageId}>
            <img src={image.url} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <button className="carousel-button prev-button" onClick={prevSlide}>
        <IoIosArrowBack />
      </button>
      <button className="carousel-button next-button" onClick={nextSlide}>
        <IoIosArrowForward />
      </button>

      <div className="pagination-container">
        <ul>
          {Array.from({ length: images.length }, (_, i) => i).map((item) => (
            <li
              key={item}
              className={currentIndex === item ? "active" : ""}
              onClick={() => paginationHandler(item)}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageCarousel;
