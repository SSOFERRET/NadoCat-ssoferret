import "../../styles/scss/components/comment/commentError.scss";
import ExclamationMarkCat from "../../assets/img/exclamationMarkCat.png";

interface IProps {
  text: string;
}
const ServerError = ({ text }: IProps) => {
  return (
    <div className="comments-error">
      <img src={ExclamationMarkCat} alt="Comments Error Cat" />
      <span>{text}</span>
      <span>나중에 다시 시도해 주세요.</span>
    </div>
  );
};

export default ServerError;
