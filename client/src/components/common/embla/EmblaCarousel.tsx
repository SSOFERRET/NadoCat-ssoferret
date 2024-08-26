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
        <div className="embla__container">{children}</div>
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

      {/* <div className="embla__controls">
        <div className="embla__buttons"></div>
      </div> */}
    </section>
  );
};

export default EmblaCarousel;

// <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
// <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />

{
  /* {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <img
                  className="embla__slide__img"
                  src={`https://picsum.photos/600/350?v=${index}`}
                  alt="Your alt text"
                />
              </div>
            </div>
          ))} */
}
