import useAlertMessageStore, { MessageType } from "../../../store/alertMessage";
import "../../../styles/scss/components/common/AlertMessage/message.scss";

interface IProps {
  id: number;
  text: string;
  type: MessageType;
}

const REMOVE_DELAY = 2500;

const AlertMessage = ({ id, text, type }: IProps) => {
  const remove = useAlertMessageStore((state) => state.removeMessage);

  setTimeout(() => {
    remove(id);
  }, REMOVE_DELAY);

  return (
    <div className="message-container">
      <span className={`${type}`}>{text}</span>
    </div>
  );
};

export default AlertMessage;
