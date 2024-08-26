import { useState } from "react";
import "../../styles/scss/components/common/imageCarousel.scss";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IImage } from "../../models/image.model";

interface IProps {
  images: IImage[];
  round?: "round-5" | "round-10" | "round-0";
  size?: "sm" | "md";
}

const ImageCarousel = ({ images, round = "round-5", size = "md" }: IProps) => {
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
    <div className={`carousel-container ${round} ${size}`}>
      <div className="carousel-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
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
