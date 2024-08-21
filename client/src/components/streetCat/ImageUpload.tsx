import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import deleteBtn from "../../assets/img/deleteBtn.png";
import "../../styles/scss/components/streetCat/imageUpload.scss";

const AddImage: React.FC = () => {
  return (
    <>
    <section className="add-image-section">
      <div className="image-container">
        <button className="add-image-btn">
          <AiOutlinePlus />
        </button>

        <div className="img-box">
          <img src="" alt="" />
          <button className="img-delete-btn">
            <img src={deleteBtn} alt="deleteBtn" />
          </button>
        </div>
        {/* <div className="img-box">
          <img src="" alt="" />
          <button className="img-delete-btn">
            <img src={deleteBtn} alt="deleteBtn" />
          </button>
        </div>
        <div className="img-box">
          <img src="" alt="" />
          <button className="img-delete-btn">
            <img src={deleteBtn} alt="deleteBtn" />
          </button>
        </div>
        <div className="img-box">
          <img src="" alt="" />
          <button className="img-delete-btn">
            <img src={deleteBtn} alt="deleteBtn" />
          </button>
        </div>
        <div className="img-box">
          <img src="" alt="" />
          <button className="img-delete-btn">
            <img src={deleteBtn} alt="deleteBtn" />
          </button>
        </div> */}
      </div>
    </section>
    </>
  )
}

export default AddImage;