// import React, { useCallback, useRef } from "react";
import "../../styles/scss/components/streetCat/discoveryLocation.scss";
import { Map, MapMarker } from "react-kakao-maps-sdk";
// import KakaoMap from "./StreetCatsMap";
// import StreetCatsMap from "./StreetCatsMap";

// NOTE center의 lat, lng 값 변수로 넣었을때 지도 하얗게 보이는 이슈

declare global {
  interface Window {
    kakao: any;
  }
}

interface ILocationProps {
  location?: {
    latitude?: number;
    longitude?: number;
    detail?: string;
  };
}

const DiscoveryLocation = (props: ILocationProps) => {
  const latitude = props.location?.latitude ?? 37.5665;
  const longitude = props.location?.longitude ?? 126.978;

  return (
    <>
      <div className="discovery-container">
        <span className="guide-title">발견 장소</span>
        <span className="location">{props.location?.detail}</span>
        <div className="map">
          <Map
            center={{ lat: latitude, lng: longitude }}
            style={{ width: "100%", height: "200px" }}
          >
            <MapMarker
              position={{ lat: latitude, lng: longitude }}
              // image={{
              //   src: "https://lh3.google.com/u/0/d/1oxnGR7Fqzu6EgddS18uKrpK62jqTUGHe=w1062-h918-iv2",
              //   size: {
              //     width: 30,
              //     height: 30,
              //   },
              // }}
            >
              {/* <div style={{color:"#000"}}>Hello World!</div> */}
            </MapMarker>
          </Map>
        </div>
      </div>
    </>
  );
};

export default DiscoveryLocation;
