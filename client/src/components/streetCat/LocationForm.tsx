import React, { useState } from 'react';
import { HiLocationMarker } from "react-icons/hi";

declare global {
  interface Window {
    daum: any;
    kakao: any;
  }
}

interface IProps {
  location: string;
  setLocation: (location: string) => void;
  setCoordinates: (coordinates: { lat: string; lng: string }) => void;
}

const LocationForm: React.FC<IProps> = ({ location, setLocation, setCoordinates }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(location);
  const [coordinates, setLocalCoordinates] = useState<{ lat: string; lng: string } | null>(null);

  const handleClick = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const fullAddress = data.address;
        setSelectedLocation(fullAddress);
        setLocation(fullAddress);
        
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(fullAddress, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lng = result[0].x;
            const coords = { lat, lng };
            setLocalCoordinates(coords);
            setCoordinates(coords);
          } else {
            console.error('주소 변환 실패:', status);
          }
        });
      },
    }).open();
  };

  return (
      <div className="select-location-box" onClick={handleClick}>
        <HiLocationMarker /> 
        <span className={selectedLocation ? "select-location" : ""}>{selectedLocation || "위치를 선택해 주세요"}</span>
        {coordinates && (
        <>
          <input type="hidden" name="lat-value" value={coordinates.lat}></input>
          <input type="hidden" name="lng-value" value={coordinates.lng}></input>
        </>
        )}
      </div>
  );
};

export default LocationForm;
