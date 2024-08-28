import "../../styles/scss/components/home/topBenner.scss";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "../common/embla/EmblaCarouselDotButton";
import { usePrevNextButtons } from "../common/embla/EmblaCarouselArrowButtons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import banner1 from "../../assets/banner/banner1.png";
import banner2 from "../../assets/banner/banner2.png";
import banner3 from "../../assets/banner/banner3.png";
import Autoplay from "embla-carousel-autoplay";

const bannersData = [
  {
    id: 1,
    url: banner1,
  },
  {
    id: 2,
    url: banner2,
  },
  {
    id: 3,
    url: banner3,
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
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [Autoplay({ playOnInit: true, delay: 4000 })]);

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
