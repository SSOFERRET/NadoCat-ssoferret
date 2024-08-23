import "../../styles/scss/components/missing/MissingCatPostWriteForm.scss";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { ICatInfo } from "../../pages/missing/MissingPostWrite";

interface IProps {
  setCatInfo: (catInfo: ICatInfo) => void;
}

type TCatGender = "-" | "F" | "M" | undefined;

const MissingCatWriteForm = ({ setCatInfo }: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [catName, setCatName] = useState<string>("");
  const [birth, setBirth] = useState<string | undefined>();
  const [gender, setGender] = useState<TCatGender>("M");
  const [detail, setDetail] = useState<string>("");

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "rem";
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "catName") {
      setCatName(value);
      console.log(value);
    } else if (name === "detail") {
      setDetail(value);
      console.log(value);
    } else if (name === "birth") {
      setBirth(value);
      console.log(value);
    }
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const formData = new FormData();

  //   formData.append("title", title);
  //   formData.append("content", content);
  //   boardCategory === "event" &&
  //     formData.append("isClosed", isClosed ? "true" : "");
  //   formData.append("tags", JSON.stringify(newTags));

  //   Array.from(newImages).forEach((image) => {
  //     formData.append("images", image);
  //   });

  //   addPost(formData);
  // };

  useEffect(() => {
    handleResizeHeight();
  }, [textareaRef.current?.value]);

  const handleGenderButton = (pickedGender: TCatGender) =>
    gender !== pickedGender ? setGender(pickedGender) : null;

  return (
    <div className="cat-post-write">
      {/* <form onSubmit={handleSubmit} className="post-form"> */}
      <input
        className="cat-name"
        name="catName"
        value={catName}
        onChange={handleChange}
        min={1}
        type="text"
        placeholder="고양이 이름을 적어주세요."
        required
      />

      <input
        className="birth"
        name="birth"
        value={birth}
        onChange={handleChange}
        min={1}
        type="text"
        placeholder="출생 연월을 작성해주세요."
        required
      />

      <div className="gender-button">
        <p className="gender-column">성별을 선택하세요</p>
        <input
          className={`gender ${gender === "M" ? "picked" : "unpicked"}`}
          name="male"
          onChange={handleChange}
          onClick={() => handleGenderButton("M" as TCatGender)}
          min={1}
          value="수컷"
          type="button"
        />
        <input
          className={`gender ${gender === "F" ? "picked" : "unpicked"}`}
          name="male"
          onChange={handleChange}
          onClick={() => handleGenderButton("F" as TCatGender)}
          min={1}
          value="암컷"
          type="button"
        />
        <input
          className={`gender ${gender === "-" ? "picked" : "unpicked"}`}
          name="male"
          onChange={handleChange}
          onClick={() => handleGenderButton("-" as TCatGender)}
          min={1}
          value="모름"
          type="button"
        />
      </div>

      <input
        className="detail"
        name="detail"
        value={detail}
        onChange={handleChange}
        min={1}
        type="text"
        placeholder="특징을 짧게 작성해주세요."
        required
      />

      <button
        className={`post-submit ${
          !catName || !detail ? "submit-disabled" : "abled"
        }`}
        disabled={!catName || !detail}
        onClick={() => {
          console.log("폼에서 출력", { catName, detail, gender, birth });
          setCatInfo({ catName, detail, gender, birth });
        }}
      >
        실종 사고 작성 페이지로 이동
      </button>
    </div>
  );
};

export default MissingCatWriteForm;
