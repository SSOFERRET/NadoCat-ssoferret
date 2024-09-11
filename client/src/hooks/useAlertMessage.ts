import useAlertMessageStore from "../store/alertMessage";

export const useAlertMessage = () => {
  const showAlertMessage = useAlertMessageStore((state) => state.addMessage);

  return { showAlertMessage };
};
