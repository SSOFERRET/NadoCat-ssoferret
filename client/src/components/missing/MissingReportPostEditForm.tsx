import { BiCheck } from "react-icons/bi";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import ImageUploader from "../communityAndEvent/ImageUploader";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IMissingReport } from "../../models/missing.model";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import LocationForm from "../streetCat/LocationForm";
import Calendar from "../streetCat/Calendar";
import { formatDateTime } from "./MissingWriteForm";
import { extractDateTimeComponents } from "./MissingPostEditForm";

interface IEditFormProps {
  onSubmit: (formData: FormData) => void;
  initialData: IMissingReport;
}

const MissingReportPostEditForm: React.FC<IEditFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const oldImages = initialData.images.map((image) => image.url);
  const [newImages, setNewImages] = useState<(string | File)[]>(oldImages);

  const [formattedDate, amPm, hours, minutes] = extractDateTimeComponents(
    initialData.time
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(formattedDate)
  );
  const [selectedAmPm, setSelectedAmPm] = useState<string>(amPm);
  const [selectedHour, setSelectedHour] = useState<string>(hours);
  const [selectedMinute, setSelectedMinute] = useState<string>(minutes);
  const [detail, setDetail] = useState<string>(initialData.detail);
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

    if (name === "detail") {
      setDetail(value);
      handleResizeHeight();
    }
  };

  const checkFormValidity = () => {
    if (
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
  }, [detail, selectedDate, selectedLocation, coordinates, newImages]);

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

    const submit = {
      report: {
        time: formatDateTime(
          selectedDate as Date,
          selectedAmPm,
          Number(selectedHour),
          Number(selectedMinute)
        ),
        detail,
      },
      location: locationData,
    };

    filteredImages.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("report", JSON.stringify(submit.report));
    formData.append("location", JSON.stringify(locationData));
    formData.append("deleteImageIds", JSON.stringify(filteredImageIds));

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

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
          <div className="write-form ">
            <span className="input-title">발견 날짜</span>
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
            <span className="input-title">발견 장소</span>
            <LocationForm
              setLocation={setSelectedLocation}
              setCoordinates={setCoordinates}
            />
          </div>

          <div className="write-form description">
            <span className="textarea-title">상세 설명</span>
            <textarea
              name="detail"
              placeholder="내용을 입력해 주세요."
              ref={textareaRef}
              value={detail}
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

export default MissingReportPostEditForm;
