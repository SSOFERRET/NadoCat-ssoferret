import React from "react";
import ReactDOM from "react-dom";

interface IProps {
  children: React.ReactNode;
}

const ModalPotal = ({ children }: IProps) => {
  if (typeof window === "undefined") {
    return null;
  }

  const node = document.getElementById("modal-root") as Element;
  return ReactDOM.createPortal(children, node);
};

export default ModalPotal;
