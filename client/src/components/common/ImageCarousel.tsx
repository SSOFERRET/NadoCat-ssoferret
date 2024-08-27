import "../../styles/scss/components/common/imageCarousel.scss";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IImage } from "../../models/image.model";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "../common/embla/EmblaCarouselDotButton";
import { usePrevNextButtons } from "../common/embla/EmblaCarouselArrowButtons";

interface IProps {
  images: IImage[];
  round?: "round-5" | "round-10" | "round-0";
  size?: "sm" | "md";
}

const OPTIONS: EmblaOptionsType = {
  containScroll: "trimSnaps",
  align: "start",
  startIndex: 0,
  dragFree: false,
  loop: true,
};

const ImageCarousel = ({ images, round = "round-5", size = "md" }: IProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

  const { selectedIndex, onDotButtonClick } = useDotButton(emblaApi);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  return (
    <section className={`carousel-container ${round} ${size}`}>
      <div className="image-embla">
        <div className="image-embla__viewport" ref={emblaRef}>
          <div className="image-embla__container">
            {images.map((item) => (
              <div className="image-embla__slide" key={item.imageId}>
                <div className="image-embla__slide__img">
                  <img src={item.url} alt={item.imageId.toString()} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-button prev-button" onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
          <IoIosArrowBack />
        </button>
        <button className="carousel-button next-button" onClick={onNextButtonClick} disabled={nextBtnDisabled}>
          <IoIosArrowForward />
        </button>

        <div className="image-embla__controls">
          <div className="image-embla__dots">
            {images.map((item) => (
              <DotButton
                key={item.imageId}
                onClick={() => onDotButtonClick(item.imageId)}
                className={"image-embla__dot".concat(item.imageId - 1 === selectedIndex ? " active" : "")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
