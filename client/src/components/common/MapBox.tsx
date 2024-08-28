// import React, { useCallback, useRef, useState } from "react";
import "../../styles/scss/components/streetCat/discoveryLocation.scss";
import { Map, MapMarker } from "react-kakao-maps-sdk";

// NOTE center의 lat, lng 값 변수로 넣었을때 지도 하얗게 보이는 이슈

declare global {
  interface Window {
    kakao: any;
  }
}

interface ILocationProps {
  locations: {
    latitude: number;
    longitude: number;
    detail?: string;
  };
}

const MapBox = (props: ILocationProps) => {
  const latitude = props.locations.latitude ?? 37.5665;
  const longitude = props.locations.longitude ?? 126.978;

  return (
    <>
      <div className="discovery-container">
        {/* <span className="guide-title">발견 장소</span> */}
        {/* <span className="location">{props.location?.detail}</span> */}
        <div className="map">
        <Map
          center={{ lat: latitude, lng: longitude }}
          style={{ width: "100%", height: "200px" }}
        >
          <MapMarker 
          position={{ lat: latitude, lng: longitude }}
          image={{
            src: "https://nadocat.s3.ap-northeast-2.amazonaws.com/static/HiLocationMarker.png",
            size: {
              width: 42,
              height: 42,
            },
          }}
            >
              {/* <div style={{color:"#000"}}>Hello World!</div> */}
            </MapMarker>
          </Map>
        </div>
      </div>
    </>
  );
};

export default MapBox;
