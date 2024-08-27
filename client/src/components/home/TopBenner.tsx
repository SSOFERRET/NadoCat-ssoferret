import "../../styles/scss/components/home/topBenner.scss";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "../common/embla/EmblaCarouselDotButton";
import { usePrevNextButtons } from "../common/embla/EmblaCarouselArrowButtons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Autoplay from "embla-carousel-autoplay";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const bannersData = [
  {
    id: 1,
    url: "https://picsum.photos/id/111/1200/400",
  },
  {
    id: 2,
    url: "https://picsum.photos/id/222/1200/400",
  },
  {
    id: 3,
    url: "https://picsum.photos/id/121/1200/400",
  },
  {
    id: 4,
    url: "https://picsum.photos/id/23/1200/400",
  },
];

const OPTIONS: EmblaOptionsType = {
  containScroll: "trimSnaps",
  align: "start",
  startIndex: 0,
  dragFree: false,
  loop: true,
};

const TopBenner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

  const { selectedIndex, onDotButtonClick } = useDotButton(emblaApi);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  return (
    <section className="top-benner">
      <div className="top-benner-embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {bannersData.map((item) => (
              <div className="embla__slide" key={item.id}>
                <div className="embla__slide__img">
                  {/* {item.id} */}
                  <img src={item.url} alt="" />
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

        <div className="embla__controls">
          <div className="embla__dots">
            {bannersData.map((item) => (
              <DotButton
                key={item.id}
                onClick={() => onDotButtonClick(item.id)}
                className={"embla__dot".concat(item.id - 1 === selectedIndex ? " active" : "")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBenner;
