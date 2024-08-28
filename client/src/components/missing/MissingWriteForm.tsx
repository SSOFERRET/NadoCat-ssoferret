import { BiCheck } from "react-icons/bi";
import "../../styles/scss/pages/missing/missingWriteForm.scss";
import ImageUploader from "../communityAndEvent/ImageUploader";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Calendar from "../streetCat/Calendar";
import LocationForm from "../streetCat/LocationForm";
import CustomSelect from "./reportPost/CustomSelect";

interface IMissingWriteFormProps {
  onSubmit: (formData: FormData) => void;
}

interface ILocation {
  latitude: number;
  longitude: number;
  detail?: string;
}

export const formatDateTime = (
  dateData: Date,
  amPm: string,
  hour: number,
  minute: number
) => {
  if (amPm === "오후" && hour !== 12) {
    hour = hour + 12;
  } else if (amPm === "오전" && hour === 12) {
    hour = 0;
  }

  dateData.setHours(hour);
  dateData.setMinutes(minute);

  const year = dateData.getFullYear();
  const month = String(dateData.getMonth() + 1).padStart(2, "0");
  const day = String(dateData.getDate()).padStart(2, "0");
  const formattedHour = String(dateData.getHours()).padStart(2, "0");
  const formattedMinute = String(dateData.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${formattedHour}:${formattedMinute}`;
};

const MissingWriteForm: React.FC<IMissingWriteFormProps> = ({ onSubmit }) => {
  const [newImages, setNewImages] = useState<(string | File)[]>([]);
  const [name, setName] = useState<string>("");
  const [catDetail, setCatDetail] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("암컷");
  const [selectedBirthYear, setSelectedBirthYear] = useState<string>("2024");
  const [selectedBirthMonth, setSelectedBirthMonth] = useState<string>("1");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAmPm, setSelectedAmPm] = useState<string>("오전");
  const [selectedHour, setSelectedHour] = useState<string>("01");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [eventDetail, setEventDetail] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: "",
    lng: "",
  });

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const setNewImageFiles = <T extends string | File>(images: T[]) => {
    setNewImages([...images]);
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}rem`;
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "event-detail") {
      setEventDetail(value);
      handleResizeHeight();
    } else if (name === "name") {
      setName(value);
    } else if (name === "cat-detail") {
      setCatDetail(value);
    }
  };

  const checkFormValidity = () => {
    if (
      name &&
      selectedDate &&
      selectedLocation &&
      coordinates &&
      newImages.length > 0
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    checkFormValidity();
  }, [name, selectedDate, selectedLocation, coordinates, newImages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const locationData: ILocation = {
      latitude: parseFloat(coordinates.lat),
      longitude: parseFloat(coordinates.lng),
      detail: selectedLocation,
    };

    const birthMonth = selectedBirthMonth.padStart(2, "0");

    const formattedGender =
      selectedGender === "수컷" ? "M" : selectedGender === "암컷" ? "F" : "-";

    const missing = {
      cat: {
        name,
        detail: catDetail,
        birth: `${selectedBirthYear}-${birthMonth}-01`,
        gender: formattedGender,
      },
      location: locationData,
      missing: {
        time: formatDateTime(
          selectedDate as Date,
          selectedAmPm,
          Number(selectedHour),
          Number(selectedMinute)
        ),
        detail: eventDetail,
      },
    };

    newImages.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("cat", JSON.stringify(missing.cat));
    formData.append("missing", JSON.stringify(missing.missing));
    formData.append("location", JSON.stringify(locationData));

    onSubmit(formData);
  };

  const years = new Array(25).fill(0).map((_, index) => (2024 - index).toString());
  const months = new Array(12).fill(0).map((_, index) => (index + 1).toString());

  const ampmOptions = ["오전", "오후"];
  const hourOptions = new Array(12).fill(0).map((_, index) => `${index + 1}`);
  const minuteOptions = new Array(6).fill(0).map((_, index) => `${index}0`);

  return (
    <>
      <ImageUploader
        newImages={newImages}
        setNewImageFiles={setNewImageFiles}
      />
      <section className="missing-cat-write-section">
        <form className="write-form-container" onSubmit={handleSubmit}>
          <div className="write-form name">
            <span className="input-title">고양이 이름</span>
            <input
              className="name-input"
              type="text"
              name="name"
              placeholder="고양이 이름을 입력해주세요"
              value={name}
              onChange={handleChange}
            />
          </div>

          <div className="write-form gender">
            <span className="input-title">성별</span>
            <input
              id="gender_female"
              type="radio"
              name="gender"
              value="암컷"
              checked={selectedGender === "암컷"}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            <label htmlFor="gender_female">
              <BiCheck />
              암컷
            </label>
            <input
              id="gender_male"
              type="radio"
              name="gender"
              value="수컷"
              checked={selectedGender === "수컷"}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            <label htmlFor="gender_male">
              <BiCheck />
              수컷
            </label>
            <input
              id="gender_unknown"
              type="radio"
              name="gender"
              value="모름"
              checked={selectedGender === "모름"}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            <label htmlFor="gender_unknown">
              <BiCheck />
              모름
            </label>
          </div>

          <div className="write-form birth">
            <span className="input-title">출생 연월</span>
            <CustomSelect
              options={years}
              selectedValue={selectedBirthYear}
              onSelect={setSelectedBirthYear}
              placeholder="출생 연도를 선택하세요"
            />
            <CustomSelect
              options={months}
              selectedValue={selectedBirthMonth}
              onSelect={setSelectedBirthMonth}
              placeholder="출생 월을 선택하세요"
            />
          </div>

          <div className="write-form name">
            <span className="input-title">고양이 특징</span>
            <input
              className="cat-detail-input"
              type="text"
              name="cat-detail"
              placeholder="고양이 특징을 짧게 입력해주세요."
              value={catDetail}
              onChange={handleChange}
            />
          </div>

          <div className="write-form ">
            <span className="input-title">실종 날짜</span>
            <div className="missing-datetime">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>

          <div className="write-form time">
            <CustomSelect
              options={ampmOptions}
              selectedValue={selectedAmPm}
              onSelect={setSelectedAmPm}
              placeholder="Select AM/PM"
            />

            <CustomSelect
              options={hourOptions}
              selectedValue={selectedHour}
              onSelect={setSelectedHour}
              placeholder="Select Hour"
            />

            <CustomSelect
              options={minuteOptions}
              selectedValue={selectedMinute}
              onSelect={setSelectedMinute}
              placeholder="Select Minute"
            />
          </div>

          <div className="write-form location">
            <span className="input-title">실종 장소</span>
            <LocationForm
              setLocation={setSelectedLocation}
              setCoordinates={setCoordinates}
            />
          </div>

          <div className="write-form description">
            <span className="textarea-title">상세 설명</span>
            <textarea
              name="event-detail"
              placeholder="내용을 입력해 주세요."
              ref={textareaRef}
              value={eventDetail}
              onChange={handleChange}
              style={{ minHeight: "179rem" }}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isFormValid ? "active" : ""}`}
            disabled={!isFormValid}
          >
            작성완료
          </button>
        </form>
      </section>
    </>
  );
};

export default MissingWriteForm;