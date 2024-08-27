import { BiCheck } from "react-icons/bi";
import "../../styles/scss/pages/streetCat/streetCatWrite.scss";
import ImageUploader from "../communityAndEvent/ImageUploader";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import LocationForm from "./LocationForm";
import { IStreetCatDetail, IStreetCatEdit } from "../../models/streetCat.model";

interface IEditFormProps {
  onSubmit: (formData: FormData) => void;
  initialData: IStreetCatEdit | IStreetCatDetail; // 적절한 타입을 설정하세요
}

const EditForm: React.FC<IEditFormProps> = ({ initialData, onSubmit }) => {
  const oldImages = initialData.streetCatImages.map((image) => image.url);
  const [newImages, setNewImages] = useState<(string | File)[]>(oldImages);
  const [name, setName] = useState<string>(initialData.name);
  const [selectedGender, setSelectedGender] = useState<string>(
    initialData.gender
  );
  const [selectedNeutered, setSelectedNeutered] = useState<string>(
    initialData.neutered
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialData.discoveryDate ? new Date(initialData.discoveryDate) : null
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialData.location.detail
  );
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: initialData.location.latitude.toString(),
    lng: initialData.location.longitude.toString(),
  });
  const [description, setDescription] = useState<string>(initialData.content);

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

    if (name === "description") {
      setDescription(value);
      handleResizeHeight();
    } else if (name === "name") {
      setName(value);
    }
  };

  const checkFormValidity = () => {
    if (
      name &&
      selectedGender &&
      selectedNeutered &&
      selectedDate &&
      selectedLocation &&
      coordinates &&
      description &&
      newImages.length > 0
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    checkFormValidity();
  }, [
    name,
    selectedGender,
    selectedNeutered,
    selectedDate,
    selectedLocation,
    coordinates,
    description,
    newImages,
  ]);

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
    const filteredImageIds = initialData.streetCatImages
      .filter((image) => !newImages.includes(image.url))
      .map((item) => item.imageId);
    const filteredImages = newImages.filter(
      (image): image is File => image instanceof File
    );

    console.log("filteredImages", filteredImages);
    filteredImages.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("name", name);
    formData.append("gender", selectedGender);
    formData.append("neutered", selectedNeutered);
    formData.append(
      "discoveryDate",
      selectedDate ? selectedDate.toISOString() : ""
    );
    formData.append("location", JSON.stringify(locationData));
    formData.append("content", description);
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

          <div className="write-form neutered">
            <span className="input-title">중성화</span>
            <input
              id="neutered_did"
              type="radio"
              name="neutered"
              value="실시"
              checked={selectedNeutered === "실시"}
              onChange={(e) => setSelectedNeutered(e.target.value)}
            />
            <label htmlFor="neutered_did">
              <BiCheck />
              실시
            </label>
            <input
              id="neutered_didnt"
              type="radio"
              name="neutered"
              value="미실시"
              checked={selectedNeutered === "미실시"}
              onChange={(e) => setSelectedNeutered(e.target.value)}
            />
            <label htmlFor="neutered_didnt">
              <BiCheck />
              미실시
            </label>
            <input
              id="neutered_unknown"
              type="radio"
              name="neutered"
              value="모름"
              checked={selectedNeutered === "모름"}
              onChange={(e) => setSelectedNeutered(e.target.value)}
            />
            <label htmlFor="neutered_unknown">
              <BiCheck />
              모름
            </label>
          </div>

          <div className="write-form discovery">
            <span className="input-title">발견날짜</span>
            <div className="discovery-date">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>

          <div className="write-form location">
            <span className="input-title">발견장소</span>
            <LocationForm
              location={selectedLocation}
              setLocation={setSelectedLocation}
              setCoordinates={setCoordinates}
            />
          </div>

          <div className="write-form description">
            <span className="textarea-title">고양이에 대해</span>
            <textarea
              name="description"
              placeholder="내용을 입력해 주세요."
              ref={textareaRef}
              value={description}
              onChange={handleChange}
              style={{ minHeight: "179rem" }}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isFormValid ? "active" : ""}`}
            disabled={!isFormValid}
          >
            수정완료
          </button>
        </form>
      </section>
    </>
  );
};

export default EditForm;
