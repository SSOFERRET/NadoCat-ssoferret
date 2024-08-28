import { useNavigate } from "react-router-dom";
import EmblaCarousel from "../common/embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Avatar from "../common/Avatar";
import { formatDate } from "../../utils/format/format";
import { MdDateRange } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import useMissings from "../../hooks/useMissings";

const OPTIONS: EmblaOptionsType = {
  containScroll: "trimSnaps",
  align: "start",
  // slidesToScroll: 1,
  dragFree: true,
  loop: false,
};

const HomeMissings = () => {
  const navigate = useNavigate();
  const { missings } = useMissings(); // NOTE 이걸로 변경하기

  return (
    <section className="home-missings">
      <div className="header">
        <div className="title">
          <span>실종 고양이</span>
          <span>를 찾습니다.</span>
        </div>
        <button className="more" onClick={() => navigate("/boards/missings")}>
          전체보기
        </button>
      </div>

      <EmblaCarousel category="missings" options={OPTIONS} isShowButon={false}>
        {missings.map((item) => (
          <div className="embla__slide" key={item.postId}>
            <div className="embla__slide__number">
              <div className="home-missing" onClick={() => navigate(`/boards/missings/${item.postId}`)}>
                {!item.found && <span className="found">수색중</span>}
                <div className="image-container">
                  {item.images.length > 0 ? (
                    <img src={item.images[0].url} alt={item.users.nickname} />
                  ) : (
                    <div className="no-image"></div>
                  )}
                </div>

                <div className="missing-info">
                  <div className="user-details">
                    <Avatar nickname={item.users.nickname} profileImage={item.users.profileImage} />
                    <div className="user-detail">
                      <span className="nickname">{item.users.nickname}</span>
                      <span className="date">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  <div className="missing-detail">
                    <div>
                      <MdDateRange />
                      <span>{formatDate(item.time)}</span>
                    </div>
                    <div>
                      <AiOutlineExclamationCircle />
                      <span>{item.missingCats.detail}</span>
                    </div>
                    <div>
                      <HiOutlineLocationMarker />
                      <span>{item.locations.detail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
};

export default HomeMissings;
