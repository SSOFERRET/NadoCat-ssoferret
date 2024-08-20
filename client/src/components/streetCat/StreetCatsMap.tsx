import React, { useEffect } from "react";
import "../../styles/css/components/streetCat/streetCatsMap.css";
import { Map, MapMarker } from "react-kakao-maps-sdk";

declare global {
  interface Window {
    kakao: any;
  }
}

// NOTE 좌표 DB 연결 후 테스트 해야함
// CHECKLIST
// [ ] 중심 좌표 기준 근처의 location들을 불러와야 함
const locations = [
  {
    title: "삼색이",
    latlng: { lat: 33.450705, lng: 126.570677 },
  },
  {
    title: "턱시도",
    latlng: { lat: 33.450936, lng: 126.569477 },
  },
  {
    title: "치즈",
    latlng: { lat: 33.450879, lng: 126.56994 },
  },
  {
    title: "고등어",
    latlng: { lat: 33.451393, lng: 126.570738 },
  },
]

const StreetCatsMap: React.FC = () => {
  return (
    <Map // 지도를 표시할 Container
      id="map"
      center={{
        // 지도의 중심좌표 (추후 유저의 location으로 변경)
        lat: 33.450701,
        lng: 126.570667,
      }}
      level={3} // 지도의 확대 레벨
    >
      {locations.map((location, index) => (
        <MapMarker
          key={`${location.title}-${location.latlng}`}
          position={location.latlng} // 마커를 표시할 위치
          image={{
            src: "https://lh3.google.com/u/0/d/1oxnGR7Fqzu6EgddS18uKrpK62jqTUGHe=w1062-h918-iv2",
            size: {
              width: 30,
              height: 30
            },
          }}
          title={location.title}
        />
      ))}
    </Map>
  )
}

export default StreetCatsMap;