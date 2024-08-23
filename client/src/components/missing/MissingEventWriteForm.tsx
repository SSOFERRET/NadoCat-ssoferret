import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import useMissings from "../../hooks/useMissings";
import MissingCatWriteForm from "../../components/missing/MissingCatWriteForm";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ILocation } from "../../models/location.model";
import { ICatInfo } from "../../pages/missing/MissingPostWrite";

export interface IMissingEventInfo {
  time: string;
  detail?: string;
  location?: ILocation;
}

interface IProps {
  // setMissingEventInfo: (info: IMissingEventInfo) => void;
  catInfo: ICatInfo;
  addPost: (submitData: ISubmitData) => void;
}

export interface ISubmitData {
  missing: {
    time: string;
    detail: string;
  };
  location: ILocation;
  cat: {
    name: string;
    detail: string;
    gender?: string;
    birth?: string;
  };
}

const MissingEventWriteForm = ({ catInfo, addPost }: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<ILocation | undefined>();
  const [detail, setDetail] = useState<string>("");
  const navigate = useNavigate();

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

    if (name === "time") {
      setTime(value);
    } else if (name === "detail") {
      setDetail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!location) {
    //   alert("위치 정보를 입력해주세요.");
    //   return;
    // }

    const submitData: ISubmitData = {
      missing: {
        time,
        detail,
      },
      location: {
        longitude: Number(127),
        latitude: Number(37),
        detail: "",
      },
      cat: {
        name: catInfo.catName,
        gender: catInfo.gender,
        detail: catInfo.detail,
        birth: catInfo.birth,
      },
    };

    addPost(submitData);
  };

  useEffect(() => {
    handleResizeHeight();
  }, [textareaRef.current?.value]);

  return (
    <div className="missing-post-write">
      <form onSubmit={handleSubmit}>
        <input
          className="time"
          name="time"
          value={time}
          onChange={handleChange}
          type="text"
          placeholder="실종 일시를 입력하세요."
          required
        />

        {/* 위치 입력 로직이 추가되어야 함 */}
        {/* 위치 선택 시 setLocation을 통해 location 상태 업데이트 */}

        <textarea
          className="post-textarea"
          onChange={handleChange}
          ref={textareaRef}
          name="detail"
          value={detail}
          rows={1}
          minLength={1}
          placeholder="내용을 입력해 주세요."
          required
        />

        <button
          className={`post-submit ${!time ? "submit-disabled" : "abled"}`}
          disabled={!time}
          type="submit"
        >
          작성완료
        </button>
      </form>
    </div>
  );
};

export default MissingEventWriteForm;
