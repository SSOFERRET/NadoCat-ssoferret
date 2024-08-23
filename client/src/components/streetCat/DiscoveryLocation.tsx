import React, { useCallback, useRef } from "react";
import "../../styles/scss/components/streetCat/discoveryLocation.scss";
import { Map, MapMarker } from "react-kakao-maps-sdk";

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
  const longitude = props.location?.longitude ?? 126.9780;

  return (
    <>
      <div className="discovery-container">
        <span className="guide-title">발견 장소</span>
        <span className="location">{props.location?.detail}</span>
        <div className="map">
        <Map
          center={{ lat: 37.5665, lng: 126.9780 }}
          style={{ width: "100%", height: "200px" }}
        >
          <MapMarker position={{ lat: 37.5665, lng: 126.9780 }}>
            {/* <div style={{color:"#000"}}>Hello World!</div> */}
          </MapMarker>
        </Map>
        </div>
      </div>
    </>
  )
}

export default DiscoveryLocation;
