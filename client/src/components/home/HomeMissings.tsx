import { useNavigate } from "react-router-dom";
import EmblaCarousel from "../common/embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Avatar from "../common/Avatar";
import { formatDate } from "../../utils/format/format";
import { MdDateRange } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

const missings = [
  {
    postId: 1,
    time: "2024-08-12T00:00:00.000Z",
    found: 0,
    createdAt: "2024-08-25T19:27:23.000Z",
    users: {
      nickname: "test1",
      profileImage: null,
    },
    missingCats: {
      name: "ㅁㄴㅇㄹ",
      detail: "ㅁㄴㅇㄹ",
    },
    locations: {
      detail: "주소 주소",
    },
    images: [],
  },
  {
    postId: 2,
    found: 0,
    time: "2024-08-12T00:00:00.000Z",
    createdAt: "2024-08-25T19:27:23.000Z",
    users: {
      nickname: "test2",
      profileImage: null,
    },
    missingCats: {
      name: "ㅁㄴㅇㄹ",
      detail: "ㅁㄴㅇㄹ",
    },
    locations: {
      detail: "응 주소야",
    },
    images: [],
  },
  {
    postId: 3,
    found: 1,
    time: "2024-08-12T00:00:00.000Z",
    createdAt: "2024-08-25T19:27:23.000Z",
    users: {
      nickname: "test3",
      profileImage: null,
    },
    missingCats: {
      name: "ㅁㄴㅇㄹ",
      detail: "ㅁㄴㅇㄹ",
    },
    locations: {
      detail: "여기 주소임",
    },
    images: [],
  },
  {
    postId: 4,
    found: 0,
    time: "2024-08-12T00:00:00.000Z",
    createdAt: "2024-08-25T19:27:23.000Z",
    users: {
      nickname: "test4",
      profileImage: null,
    },
    missingCats: {
      name: "ㅁㄴㅇㄹ",
      detail: "ㅁㄴㅇㄹ",
    },
    locations: {
      detail: "주소다",
    },
    images: [
      {
        imageId: 1,
        url: "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww",
      },
    ],
  },
];

const OPTIONS: EmblaOptionsType = {
  containScroll: "trimSnaps",
  align: "start",
  // slidesToScroll: 1,
  dragFree: true,
  loop: false,
};

const HomeMissings = () => {
  const navigate = useNavigate();
  // const { missings } = useMissings(); // NOTE 이걸로 변경하기

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
                      <span>{item.time}</span>
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
