import EmblaCarousel from "../common/embla/EmblaCarousel";
import paw from "../../assets/img/paw.svg";
import { useStreetCatPosts } from "../../hooks/useStreetCats";
import FavoriteButton from "../common/FavoriteButton";
import { EmblaOptionsType } from "embla-carousel";
import { useNavigate } from "react-router-dom";

const OPTIONS: EmblaOptionsType = {
  containScroll: "trimSnaps",
  align: "start",
  dragFree: true,
  loop: false,
};

const HomeStreetCats = () => {
  const navigate = useNavigate();
  const { streetCatPosts } = useStreetCatPosts(true);

  return (
    <section className="home-street-cat-container">
      <div className="header">
        <div className="title">
          <img src={paw} alt="paw" />
          <span>우리 동네 고양이</span>
        </div>
        <button className="more" onClick={() => navigate("/boards/street-cats")}>
          전체보기
        </button>
      </div>

      <EmblaCarousel category="streetCat" options={OPTIONS} isShowButon={false}>
        {streetCatPosts.map((cat, index) => (
          <div className="embla__slide" key={index}>
            <div className="embla__slide__number">
              <div key={cat?.postId} className="home-street-cat">
                {cat?.postId !== undefined && cat?.streetCatFavorites !== undefined ? (
                  <FavoriteButton postId={cat.postId} like={cat.streetCatFavorites?.length} />
                ) : (
                  ""
                )}
                <a href={`/boards/street-cats/${cat?.postId}`}>
                  <div className="home-street-cat-image-container">
                    <img src={cat?.streetCatImages[0]?.images.url} loading="lazy" alt="Street cat" />
                  </div>
                  <div className="street-cat-info">
                    <span className="name">{cat?.name}</span>
                    <span className="date">{new Date(cat?.createdAt as Date).toLocaleDateString()}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
};

export default HomeStreetCats;
