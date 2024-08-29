import React, { /* useEffect,*/ useState } from "react";
import "../../styles/scss/components/streetCat/streetCatsMap.scss";
import {
  /* CustomOverlayMap,*/ Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import deleteBtn from "../../assets/img/deleteBtn.png";
import { useReadStreetMap } from "../../hooks/useStreetCat";

declare global {
  interface Window {
    kakao: any;
  }
}

interface IStreetCat {
  discoveryDate: string;
  name: string;
  postId: number;
  streetCatImages: { imageId: number; images: string }[];
}

interface ILocationData {
  locationId: number;
  latitude: number;
  longitude: number;
  detail: string;
  streetCats: IStreetCat[];
}

interface IStreetCatModalProps {
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  postId: number;
  name: string;
  discoveryDate: string;
  url: string;
}

const StreetCatModal: React.FC<IStreetCatModalProps> = ({
  onClose,
  postId,
  name,
  discoveryDate,
  url,
}) => (
  <div className="street-cat-modal">
    <a href={`/boards/street-cats/${postId}`}>
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          <img src={deleteBtn} alt="close-btn" />
        </button>
        <div className="cat-thumbnail">
          <img src={url} alt="cat-thumbnail" />
        </div>
        <div className="cat-info">
          <span className="name">{name}</span>
          <span className="discovery-date">
            {new Date(discoveryDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </a>
  </div>
);

const CustomOverlayStyle = () => (
  <style>{`
    .street-cat-modal {
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 144rem;
      height: 120rem;
      background-color: #fff;
      border-radius: 5rem;
      position: absolute;
      bottom: 10rem;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      box-shadow: 0 5px 10px -7px rgb(87, 87, 87);
    }

    a {
      text-decoration: unset;
    }

    .modal-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%
      position: relative;
    }

    .close-btn {
      width: 30rem;
      height: 30rem;
      position: absolute;
      right: -14px;
      top: -12rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      z-index: 1001;

      img {
        width: 30rem;
        height: 30rem;
      }
    }

    .cat-thumbnail {
      width: 50rem;
      height: 50rem;
      background-color: #F2B705;
      border-radius: 50%;
      margin-top: 15rem;

      img {
        width: 50rem;
        height: 50rem;
        border-radius: 50%;
      }
    }

    .cat-info {
      font-size: 14rem;
      text-align: center;
      margin-top: 8rem;

      span {
        display: block;
      }
        
      .name {
        font-family: "bold";
        font-size: 14rem;
        color: #191919;
      }

      .discovery-date {
        font-family: "medium";
        font-size: 12rem;
        margin-top: 3rem;
        color: #B8BCBF;
      }
    }
  `}</style>
);

const StreetCatsMap: React.FC = () => {
  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY });
  const [mapData, setMapData] = useState<{
    level: number;
    position: {
      lat: number;
      lng: number;
    };
  }>({
    level: 4,
    position: {
      lat: 37.485615979201,
      lng: 127.01099825247,
    },
  });
  const [selectedCat, setSelectedCat] = useState<IStreetCat | null>(null);

  // mapData가 변경될 때마다 근처 데이터 통신
  const {
    data: nearLocations,
    // isLoading,
    // error,
  } = useReadStreetMap(
    mapData.position.lat,
    mapData.position.lng,
    mapData.level
  );

  const handleMarkerClick = (streetCat: IStreetCat) => {
    setSelectedCat(streetCat);
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setSelectedCat(null);
  };

  const handleDragEnd = (map: kakao.maps.Map) => {
    const level = map.getLevel();
    const latlng = map.getCenter();

    const newMapData = {
      level: level,
      position: {
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      },
    };

    setMapData(newMapData);
  };

  return (
    <>
      <CustomOverlayStyle />
      <Map
        id="map"
        center={mapData.position}
        style={{
          width: "100%",
        }}
        level={mapData.level}
        onDragEnd={handleDragEnd}
      >
        {nearLocations &&
          nearLocations.map((location: ILocationData) =>
            location.streetCats.map((cat: IStreetCat) => (
              <MapMarker
                key={cat.postId}
                position={{ lat: location.latitude, lng: location.longitude }}
                onClick={() => handleMarkerClick(cat)}
                image={{
                  src: "https://nadocat.s3.ap-northeast-2.amazonaws.com/static/HiLocationMarker.png",
                  size: {
                    width: 42,
                    height: 42,
                  },
                  options: {
                    offset: {
                      x: 27,
                      y: 69,
                    },
                  },
                }}
              />
            ))
          )}
      </Map>

      {selectedCat && (
        <StreetCatModal
          postId={selectedCat.postId}
          onClose={handleCloseModal}
          name={selectedCat.name}
          discoveryDate={selectedCat.discoveryDate}
          url={selectedCat.streetCatImages[0]?.images}
        />
      )}
    </>
  );
};

export default StreetCatsMap;
