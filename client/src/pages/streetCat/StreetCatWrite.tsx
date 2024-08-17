import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { AiFillClockCircle } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import deleteBtn from "../../assets/img/deleteBtn.png";
import "../../styles/css/base/reset.css";
import "../../styles/css/pages/streetCat/streetCatWrite.css";
import ImageUpload from "../../components/streetCat/ImageUpload";

const StreetCatWrite: React.FC = () => {
  return (
    <>
      <ImageUpload />
      
      <section className="street-cat-write-section">
        <div className="write-form name">
          <span className="input-title">고양이 이름</span>
          <input className="name-input" type="text" placeholder="고양이 이름을 입력해주세요"/>
        </div>

        <div className="write-form gender">
          <span className="input-title">성별</span>

          <input id="gender_female" type="radio" name="gender" value="암컷" checked/>
          <label htmlFor="gender_female"><BiCheck />암컷</label>

          <input id="gender_male" type="radio" name="gender" value="수컷"/>
          <label htmlFor="gender_male"><BiCheck />수컷</label>

          <input id="gender_unknown" type="radio" name="gender" value="모름"/>
          <label htmlFor="gender_unknown"><BiCheck />모름</label>
        </div>

        <div className="write-form neutered">
          <span className="input-title">중성화</span>

          <input id="neutered_did" type="radio" name="neutered" value="실시" checked/>
          <label htmlFor="neutered_did"><BiCheck />실시</label>

          <input id="neutered_didnt" type="radio" name="neutered" value="미실시"/>
          <label htmlFor="neutered_didnt"><BiCheck />미실시</label>

          <input id="neutered_unknown" type="radio" name="neutered" value="모름"/>
          <label htmlFor="neutered_unknown"><BiCheck />모름</label>
        </div>

        <div className="write-form discovery">
          <span className="input-title">발견시각</span>
          <div>
            <AiFillClockCircle /> <span>2024년 07월 10일   오전 11:32</span>
            <input id="discovery_now" type="checkbox" />
            <label htmlFor="discovery_now"><BiCheck /></label>
            <span className="check-text">지금</span>
          </div>
        </div>
        
        <div className="write-form location">
          <span className="input-title">발견장소</span>
          <div>
            <HiLocationMarker /> <span>위치를 선택해 주세요</span>
          </div>
        </div>

        <div className="write-form description">
          <span className="input-title">고양이에 대해</span>
          <textarea name="" id="" placeholder="내용을 입력해 주세요.">
          </textarea>
        </div>
      </section>
    </>
  )
}

export default StreetCatWrite;