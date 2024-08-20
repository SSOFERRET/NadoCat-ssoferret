import "../../styles/css/components/loading/loadingCat.css";
import LoadingRing from "../../assets/loading/loading_ring.svg";
import LoadingCheese from "../../assets/loading/loading_cheese.svg";
import ModalPotal from "../modal/ModalPotal";

const LoadingCat = () => {
  return (
    <ModalPotal>
      <div className="loading-container">
        <div className="overlay">
          <div className="spinner">
            <img
              className="loading-ring"
              src={LoadingRing}
              alt="Loading Ring"
            />
            <img
              className="loading-cheese"
              src={LoadingCheese}
              alt="Loading Cheese"
            />
          </div>
        </div>
      </div>
    </ModalPotal>
  );
};

export default LoadingCat;
