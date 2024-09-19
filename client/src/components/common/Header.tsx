import React from "react";
import logoHeader from "../../assets/img/logoHeader.png";
import "../../styles/css/base/reset.css";
import "../../styles/scss/components/common/header.scss";
import { Link, useNavigate } from "react-router-dom";
import NotificationAlarm from "../notifications/NotificationAlarm";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <header>
        <h1 className="logo">
          <Link to="/">
            <img src={logoHeader} alt="logo-header" />
          </Link>
        </h1>

        <button
          className="alarm-button"
          onClick={() => navigate("/notification")}
        >
          <NotificationAlarm />
        </button>
      </header>
    </>
  );
};
