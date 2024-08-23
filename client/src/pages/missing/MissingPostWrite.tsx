import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import useMissings from "../../hooks/useMissings";
import MissingCatWriteForm from "../../components/missing/MissingCatWriteForm";
import { useState } from "react";
import { ILocation } from "../../models/location.model";
import MissingEventWriteForm, {
  ISubmitData,
} from "../../components/missing/MissingEventWriteForm";

export interface ICatInfo {
  catName: string;
  birth?: string;
  gender?: string;
  detail: string;
}

export interface IMissingEventInfo {
  time?: string;
  location?: ILocation;
  detail?: string;
}

const MissingPostWrite = () => {
  const navigate = useNavigate();
  const { addMissingPost } = useMissings();
  const [catInfo, setCatInfo] = useState<ICatInfo | undefined>();
  const [eventInfo, setEventInfo] = useState<IMissingEventInfo | undefined>();

  const addPost = (submitData: ISubmitData) => {
    addMissingPost(submitData).then((data) => {
      console.log("작성 완료!");
      navigate(`/boards/missings/${data.postId}`);
    });
  };

  return (
    <div className="missing-post-edit">
      <HeaderWithBackButton />
      {catInfo?.catName ? (
        <>
          <p className="info">고양이 정보 입력 완료</p>
          <p>{catInfo.catName}</p>
          <MissingEventWriteForm catInfo={catInfo} addPost={addPost} />
        </>
      ) : (
        <MissingCatWriteForm setCatInfo={setCatInfo} />
      )}
    </div>
  );
};

export default MissingPostWrite;
