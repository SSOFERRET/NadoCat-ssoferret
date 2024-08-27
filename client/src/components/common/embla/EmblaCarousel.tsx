import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import "../../../styles/scss/components/common/embla.scss";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface IProps {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  isShowButon?: boolean;
  category: "streetCat" | "missings";
}

const EmblaCarousel = ({ options, children, isShowButon = true, category }: IProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  return (
    <section className={`embla ${category}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className={`embla__container ${category}`}>{children}</div>
      </div>

      {isShowButon && (
        <>
          <button className="carousel-button prev-button" onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
            <IoIosArrowBack />
          </button>
          <button className="carousel-button next-button" onClick={onNextButtonClick} disabled={nextBtnDisabled}>
            <IoIosArrowForward />
          </button>
        </>
      )}
    </section>
  );
};

export default EmblaCarousel;
