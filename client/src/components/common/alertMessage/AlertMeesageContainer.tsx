import "../../../styles/scss/components/common/alertMessage/alertMessageContainer.scss";
import useAlertMessageStore from "../../../store/alertMessage";
import AlertMessage from "./AlertMessage";

const AlertMeesageContainer = () => {
  const messages = useAlertMessageStore((state) => state.messages);

  return (
    <div className="alert-message-container">
      {messages.map((item) => (
        <AlertMessage key={item.id} text={item.message} type={item.type} id={item.id} />
      ))}
    </div>
  );
};

export default AlertMeesageContainer;
