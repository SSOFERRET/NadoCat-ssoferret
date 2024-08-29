import { BiCheck } from "react-icons/bi";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import ImageUploader from "../communityAndEvent/ImageUploader";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IMissing } from "../../models/missing.model";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import LocationForm from "../streetCat/LocationForm";
import Calendar from "../streetCat/Calendar";
import { formatDateTime } from "./MissingWriteForm";
import { extractDateTimeComponents } from "../../utils/format/format";
import { formatGenderToString } from "../../utils/format/genderToString";

interface IEditFormProps {
  onSubmit: (formData: FormData) => void;
  initialData: IMissing; // 적절한 타입을 설정하세요
}

const MissingPostEditForm: React.FC<IEditFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const oldImages = initialData.images.map((image) => image.url);
  const [newImages, setNewImages] = useState<(string | File)[]>(oldImages);

  const [formattedDate, amPm, hours, minutes] = extractDateTimeComponents(
    initialData.time
  );

  //고양이 정보
  const [name, setName] = useState<string>(initialData.missingCats.name);
  const [catDetail, setCatDetail] = useState<string>(
    initialData.missingCats.detail as string
  );
  const [selectedGender, setSelectedGender] = useState<string>(
    formatGenderToString(initialData.missingCats.gender as string)
  );
  const [birthYear, birthMonth] = initialData.missingCats.birth.split("-");
  const [selectedBirthYear, setSelectedBirthYear] = useState<string>(birthYear);
  const [selectedBirthMonth, setSelectedBirthMonth] =
    useState<string>(birthMonth);

  //실종사건 정보
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(formattedDate)
  );
  const [selectedAmPm, setSelectedAmPm] = useState<string>(amPm);
  const [selectedHour, setSelectedHour] = useState<string>(hours);
  const [selectedMinute, setSelectedMinute] = useState<string>(minutes);
  const [eventDetail, setEventDetail] = useState<string>(initialData.detail);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialData.locations.detail as string
  );
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: initialData.locations.latitude.toString(),
    lng: initialData.locations.longitude.toString(),
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
    const locationData = {
      location: {
        latitude: parseFloat(coordinates.lat),
        longitude: parseFloat(coordinates.lng),
        detail: selectedLocation,
      },
    };
    const filteredImageIds = initialData.images
      .filter((image) => !newImages.includes(image.url))
      .map((item) => item.imageId);
    const filteredImages = newImages.filter(
      (image): image is File => image instanceof File
    );

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

    filteredImages.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("cat", JSON.stringify(missing.cat));
    formData.append("missing", JSON.stringify(missing.missing));
    formData.append("location", JSON.stringify(locationData));
    formData.append("deleteImageIds", JSON.stringify(filteredImageIds));

    onSubmit(formData);
  };

  return (
    <>
      <ImageUploader
        newImages={newImages}
        setNewImageFiles={setNewImageFiles}
      />
      <section className="street-cat-write-section">
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
            <select
              value={selectedBirthYear}
              onChange={(e) => setSelectedBirthYear(e.target.value)}
            >
              {new Array(25).fill(0).map((_, index) => (
                <option key={`year-${2024 - index}`} value={`${2024 - index}`}>
                  {2024 - index}
                </option>
              ))}
            </select>
            <select
              value={selectedBirthMonth}
              onChange={(e) => setSelectedBirthMonth(e.target.value)}
            >
              {new Array(12).fill(0).map((_, index) => (
                <option key={`${index + 1}`} value={`${index + 1}`}>
                  {`${index + 1}`}
                </option>
              ))}
            </select>
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
            <input
              id="gender_female"
              type="radio"
              name="ampm"
              value="오전"
              checked={selectedAmPm === "오전"}
              onChange={(e) => setSelectedAmPm(e.target.value)}
            />
            <label htmlFor="gender_female">
              <BiCheck />
              오전
            </label>
            <input
              id="gender_female"
              type="radio"
              name="ampm"
              value="오후"
              checked={selectedAmPm === "오후"}
              onChange={(e) => setSelectedAmPm(e.target.value)}
            />
            <label htmlFor="gender_female">
              <BiCheck />
              오후
            </label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
            >
              {new Array(12).fill(0).map((_, index) => (
                <option key={`hour-${index + 1}`} value={`${index + 1}`}>
                  {index + 1}
                </option>
              ))}
            </select>
            <select
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
            >
              {new Array(6).fill(0).map((_, index) => (
                <option key={`minute-${index}0`} value={`${index}0`}>
                  {`${index}0`}
                </option>
              ))}
            </select>
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

export default MissingPostEditForm;
