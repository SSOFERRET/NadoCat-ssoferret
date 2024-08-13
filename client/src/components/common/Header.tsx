import React from "react";
import logoHeader from "../../assets/img/logoHeader.png";
import { BiBell } from "react-icons/bi";
import "../../styles/css/base/normalize.css";
import "../../styles/css/components/common/header.css"
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <>
      <header>
        <h1 className="logo">
          <Link to="/">
            <img src={logoHeader} alt="logo-header" />
          </Link>
        </h1>

        <button className="alarm-button">
          <a href="/notification">
            <BiBell></BiBell>
          </a>
        </button>
      </header>
    </>
  )
}